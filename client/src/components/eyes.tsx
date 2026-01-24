import { motion } from "framer-motion"

interface EyesProps {
  tint?: string
}

/**
 * Animated eyes component with hover interaction
 */
export default function Eyes({ tint = "#09F" }: EyesProps) {
  return (
    <motion.div
      style={{
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: tint,
      }}
      animate={{ scale: 1.5 }}
      whileHover={{ rotate: 90 }}
    />
  )
}
