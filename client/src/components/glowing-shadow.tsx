import { motion } from "framer-motion";

export function GlowingShadow({ 
  children,
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative group ${className}`}>
      <div 
        className="absolute -inset-0.5 bg-gradient-to-r from-white to-white rounded-full opacity-0 blur-lg group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"
      />
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
