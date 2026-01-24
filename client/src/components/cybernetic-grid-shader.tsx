"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function CyberneticGridShader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: any
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `

    // Fragment shader
    const fragmentShader = `
      uniform float time;
      uniform vec2 resolution;
      varying vec2 vUv;

      #define PI 3.14159265359

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        
        // Perspective distortion
        uv.y += 0.5;
        vec2 p = vec2(uv.x / abs(uv.y), 1.0 / abs(uv.y));
        
        // Grid pattern
        float t = time * 0.5;
        
        // Vertical lines
        float v = smoothstep(0.95, 1.0, abs(sin(p.x * 10.0)));
        
        // Horizontal lines (moving)
        float h = smoothstep(0.95, 1.0, abs(sin(p.y * 10.0 + t * 5.0)));
        
        // Combine grid
        float grid = max(v, h);
        
        // Fade out at horizon
        float fade = smoothstep(0.0, 1.0, abs(uv.y) * 2.0);
        
        // Color
        vec3 color = vec3(0.1, 0.8, 0.9) * grid * fade; // Cyan color
        
        // Glow
        color += vec3(0.0, 0.2, 0.3) * fade * 0.5;
        
        // Scanline effect
        float scanline = sin(uv.y * 200.0 + time * 10.0) * 0.1;
        color += scanline;

        // Vignette
        float vignette = smoothstep(1.5, 0.5, length(uv));
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `

    // Initialize Three.js scene
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)

    container.appendChild(renderer.domElement)

    // Handle window resize
    const onWindowResize = () => {
      if (!container) return;
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    // Initial resize
    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.01
      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    }

    // Start animation
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full -z-10"
      style={{
        overflow: "hidden",
      }}
    />
  )
}
