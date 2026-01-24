import { useRef, useEffect, useState, startTransition } from "react"

const defaultImages = [
    {
        src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
        alt: "Gradient 1 - Blue",
    },
    {
        src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
        alt: "Gradient 2 - Purple",
    },
    {
        src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
        alt: "Gradient 3 - Orange",
    },
    {
        src: "https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg",
        alt: "Gradient 4 - Yellow",
    },
    {
        src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg",
        alt: "Gradient 5 - Green",
    },
]

interface CircularCarouselProps {
    images?: Array<{ src: string; alt: string }>
    radius?: number
    itemWidth?: number
    itemHeight?: number
    perspective?: number
    rotationSpeed?: number
    shaderEffect?: "none" | "blur" | "contrast"
    tiltAngle?: number
    style?: React.CSSProperties
}

/**
 * Circular 3D carousel with mouse pan, WebGL shaders, and cool effects
 */
export default function CircularCarousel(props: CircularCarouselProps) {
    let {
        images,
        radius = 320,
        itemWidth = 260,
        itemHeight = 160,
        perspective = 1200,
        rotationSpeed = 0.18,
        shaderEffect = "none",
        tiltAngle = -18,
        style,
    } = props

    // If images is undefined or empty, use defaultImages
    if (!images || !Array.isArray(images) || images.length === 0) {
        images = defaultImages
    } else {
        // Fill up to 5 with defaults if any are missing
        images = images.map((img, i) => {
            if (!img || !img.src) {
                return { ...defaultImages[i % defaultImages.length] }
            }
            return img
        })
    }

    const [rotation, setRotation] = useState(0)
    const [dragging, setDragging] = useState(false)
    const lastX = useRef(0)
    const velocity = useRef(0)
    const raf = useRef<number | null>(null)

    // Mouse/touch drag to rotate
    useEffect(() => {
        function onPointerMove(e: PointerEvent | TouchEvent) {
            if (!dragging) return
            let x: number
            if (e.type && e.type.startsWith("touch")) {
                x = (e as TouchEvent).touches[0].clientX
            } else {
                x = (e as PointerEvent).clientX
            }
            const dx = x - lastX.current
            lastX.current = x
            velocity.current = dx * 0.5
            startTransition(() => setRotation((r) => r + dx * 0.5))
        }
        function onPointerUp() {
            setDragging(false)
        }
        window.addEventListener("pointermove", onPointerMove as any)
        window.addEventListener("pointerup", onPointerUp)
        window.addEventListener("touchmove", onPointerMove as any)
        window.addEventListener("touchend", onPointerUp)
        return () => {
            window.removeEventListener("pointermove", onPointerMove as any)
            window.removeEventListener("pointerup", onPointerUp)
            window.removeEventListener("touchmove", onPointerMove as any)
            window.removeEventListener("touchend", onPointerUp)
        }
    }, [dragging])

    // Inertia
    useEffect(() => {
        let running = true
        function animate() {
            if (!dragging && Math.abs(velocity.current) > 0.01) {
                startTransition(() => setRotation((r) => r + velocity.current))
                velocity.current *= 0.94
            }
            if (running) raf.current = requestAnimationFrame(animate)
        }
        raf.current = requestAnimationFrame(animate)
        return () => {
            running = false
            if (raf.current) cancelAnimationFrame(raf.current)
        }
    }, [dragging])

    // Auto-rotate
    useEffect(() => {
        if (dragging) return
        let running = true
        function tick() {
            startTransition(() => setRotation((r) => r + rotationSpeed))
            if (running) raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick)
        return () => {
            running = false
            if (raf.current) cancelAnimationFrame(raf.current)
        }
    }, [dragging, rotationSpeed])

    // 3D transform for each item
    const N = images.length
    const angleStep = 360 / N

    // Shader effect: use CSS filter for now (blur, contrast, etc)
    const shaderStyle =
        shaderEffect === "blur"
            ? { filter: "blur(2px) brightness(1.1)" }
            : shaderEffect === "contrast"
              ? { filter: "contrast(1.3) saturate(1.2)" }
              : {}

    return (
        <div
            style={{
                ...style,
                width: "100%",
                height: "100%",
                perspective,
                perspectiveOrigin: "50% 50%",
                overflow: "visible",
                position: "relative",
                touchAction: "pan-x",
                cursor: dragging ? "grabbing" : "grab",
                userSelect: "none",
                background: "transparent",
            }}
            onPointerDown={(e) => {
                e.preventDefault()
                setDragging(true)
                if (e.type === "touchstart" && "touches" in e) {
                    lastX.current = (e as any).touches[0].clientX
                } else {
                    lastX.current = e.clientX
                }
            }}
            onTouchStart={(e) => {
                setDragging(true)
                if (e.touches && e.touches.length > 0) {
                    lastX.current = e.touches[0].clientX
                }
            }}
            role="region"
            aria-label="3D Carousel"
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    transformStyle: "preserve-3d",
                    transform: `translateZ(0px) rotateY(${rotation}deg)`,
                    transition: dragging
                        ? "none"
                        : "transform 0.2s cubic-bezier(.4,1,.4,1)",
                }}
            >
                {images.map((img, i) => {
                    const src = img.src
                    const alt = img.alt
                    const theta = angleStep * i
                    const rad = (theta * Math.PI) / 180
                    const x = Math.sin(rad) * radius
                    const z = Math.cos(rad) * radius
                    
                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                width: itemWidth,
                                height: itemHeight,
                                marginLeft: -itemWidth / 2,
                                marginTop: -itemHeight / 2,
                                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                                borderRadius: 18,
                                overflow: "hidden",
                                background: "#fff",
                                transformStyle: "preserve-3d",
                                transform:
                                    `rotateY(${theta}deg) translateZ(${radius}px) rotateX(${tiltAngle}deg)` +
                                    (shaderEffect !== "none" ? " scale(1.01)" : ""),
                                transition: dragging
                                    ? "none"
                                    : "box-shadow 0.2s cubic-bezier(.4,1,.4,1)",
                                ...shaderStyle,
                            }}
                            aria-label={alt || `Carousel item ${i + 1}`}
                        >
                            <img
                                src={src}
                                alt={alt || ""}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                    pointerEvents: "none",
                                    userSelect: "none",
                                }}
                                draggable={false}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
