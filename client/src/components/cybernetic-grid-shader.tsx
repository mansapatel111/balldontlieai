"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"

export function CyberneticGridShader() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        // Psuedo-random function
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          vec2 st = gl_FragCoord.xy / uResolution.xy;
          // Maintain aspect ratio
          st.x *= uResolution.x / uResolution.y;

          // Grid configuration
          float scale = 10.0;
          vec2 grid = fract(st * scale);
          vec2 id = floor(st * scale);

          // Grid lines intensity
          float lineThickness = 0.02;
          float lineBlur = 0.01;
          
          // Create grid lines
          float lines = smoothstep(lineThickness, lineThickness - lineBlur, grid.x) +
                       smoothstep(1.0 - lineThickness, 1.0 - lineThickness + lineBlur, grid.x) +
                       smoothstep(lineThickness, lineThickness - lineBlur, grid.y) +
                       smoothstep(1.0 - lineThickness, 1.0 - lineThickness + lineBlur, grid.y);
                       
          // Pulse effect
          float pulse = sin(uTime * 2.0 + length(id) * 0.5) * 0.5 + 0.5;
          
          // Random flickering cells
          float flicker = step(0.98, random(id + floor(uTime * 5.0)));
          
          // Final color composition
          vec3 baseColor = vec3(0.05, 0.05, 0.1); // Dark background
          vec3 gridColor = vec3(0.0, 0.8, 1.0) * 0.3; // Cyan grid
          vec3 pulseColor = vec3(0.5, 0.0, 1.0) * pulse; // Purple pulse
          vec3 activeColor = vec3(1.0) * flicker; // White flicker
          
          vec3 finalColor = baseColor + (gridColor * lines) + (pulseColor * lines * 0.5) + (activeColor * 0.8);
          
          // Vignette
          float vignette = 1.0 - length(vUv - 0.5) * 1.5;
          finalColor *= smoothstep(0.0, 1.0, vignette);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: true,
    })

    const plane = new THREE.Mesh(geometry, material)
    scene.add(plane)

    const animate = () => {
      requestAnimationFrame(animate)
      material.uniforms.uTime.value += 0.01
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight,
      )
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  )
}
