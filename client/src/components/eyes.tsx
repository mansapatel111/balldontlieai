import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"

interface EyesProps {
  tint?: string
}

/**
 * Animated eyes component that follow the cursor
 */
export default function Eyes({ tint = "#09F" }: EyesProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const eyesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const calculatePupilPosition = (eyeX: number, eyeY: number) => {
    if (!eyesRef.current) return { x: 0, y: 0 }

    const rect = eyesRef.current.getBoundingClientRect()
    const eyeCenterX = rect.left + eyeX
    const eyeCenterY = rect.top + eyeY

    const angle = Math.atan2(mousePosition.y - eyeCenterY, mousePosition.x - eyeCenterX)
    const distance = Math.min(8, Math.hypot(mousePosition.x - eyeCenterX, mousePosition.y - eyeCenterY) / 30)

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    }
  }

  const leftPupil = calculatePupilPosition(20, 30)
  const rightPupil = calculatePupilPosition(50, 30)

  return (
    <div ref={eyesRef} className="relative" style={{ width: 70, height: 60 }}>
      {/* Left Eye */}
      <div className="absolute" style={{ left: 5, top: 10 }}>
        <div
          className="relative bg-white rounded-full flex items-center justify-center"
          style={{ width: 30, height: 40 }}
        >
          <motion.div
            className="bg-black rounded-full"
            style={{ width: 12, height: 12 }}
            animate={{
              x: leftPupil.x,
              y: leftPupil.y,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </div>
      </div>

      {/* Right Eye */}
      <div className="absolute" style={{ left: 35, top: 10 }}>
        <div
          className="relative bg-white rounded-full flex items-center justify-center"
          style={{ width: 30, height: 40 }}
        >
          <motion.div
            className="bg-black rounded-full"
            style={{ width: 12, height: 12 }}
            animate={{
              x: rightPupil.x,
              y: rightPupil.y,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </div>
      </div>
    </div>
  )
}
