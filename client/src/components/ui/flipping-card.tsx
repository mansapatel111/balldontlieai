import React from "react";
import { cn } from "@/lib/utils";

interface FlippingCardProps {
  className?: string;
  height?: number;
  width?: number;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  onClick?: () => void;
}

export function FlippingCard({
  className,
  frontContent,
  backContent,
  height = 300,
  width = 350,
  onClick,
}: FlippingCardProps) {
  return (
    <div
      className="group/flipping-card [perspective:1000px] cursor-pointer"
      style={
        {
          "--height": `${height}px`,
          "--width": `${width}px`,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      <div
        className={cn(
          "relative rounded-xl border border-white/10 bg-black/80 shadow-lg transition-all duration-700 [transform-style:preserve-3d] group-hover/flipping-card:[transform:rotateY(180deg)]",
          "h-[var(--height)] w-[var(--width)]",
          className
        )}
      >
        {/* Front Face */}
        <div className="absolute inset-0 h-full w-full rounded-[inherit] bg-black/80 border border-white/10 text-white [transform-style:preserve-3d] [backface-visibility:hidden] [transform:rotateY(0deg)] backdrop-blur-xl overflow-hidden">
          <div className="[transform:translateZ(30px)] h-full w-full">
            {frontContent}
          </div>
           {/* Subtle holographic overlay for front */}
           <div 
             className="absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover/flipping-card:opacity-100 pointer-events-none"
             style={{
               background: `
                 radial-gradient(
                   circle at 50% 50%,
                   rgba(255, 255, 255, 0.1) 0%,
                   transparent 80%
                 )
               `,
             }}
           />
           <div 
             className="absolute inset-0 z-30 opacity-0 transition-opacity duration-300 group-hover/flipping-card:opacity-40 mix-blend-color-dodge pointer-events-none"
             style={{
                 background: "linear-gradient(135deg, rgba(255,0,0,0.5), rgba(0,255,0,0.5), rgba(0,0,255,0.5), rgba(255,0,255,0.5), rgba(255,255,0,0.5), rgba(0,255,255,0.5))",
                 filter: "blur(20px)",
             }}
           />
        </div>
        
        {/* Back Face */}
        <div className="absolute inset-0 h-full w-full rounded-[inherit] bg-black/90 border border-primary/50 text-white [transform-style:preserve-3d] [backface-visibility:hidden] [transform:rotateY(180deg)] backdrop-blur-xl overflow-hidden">
          <div className="[transform:translateZ(30px)] h-full w-full">
            {backContent}
          </div>
           {/* Subtle holographic overlay for back */}
           <div 
             className="absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover/flipping-card:opacity-100 pointer-events-none"
             style={{
               background: `
                 radial-gradient(
                   circle at 50% 50%,
                   rgba(255, 255, 255, 0.1) 0%,
                   transparent 80%
                 )
               `,
             }}
           />
           <div 
             className="absolute inset-0 z-30 opacity-0 transition-opacity duration-300 group-hover/flipping-card:opacity-40 mix-blend-color-dodge pointer-events-none"
             style={{
                 background: "linear-gradient(135deg, rgba(255,0,0,0.5), rgba(0,255,0,0.5), rgba(0,0,255,0.5), rgba(255,0,255,0.5), rgba(255,255,0,0.5), rgba(0,255,255,0.5))",
                 filter: "blur(20px)",
             }}
           />
        </div>
      </div>
    </div>
  );
}
