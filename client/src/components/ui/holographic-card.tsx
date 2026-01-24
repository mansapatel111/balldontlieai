import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HolographicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const HolographicCard = ({ children, className, ...props }: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
    card.style.setProperty("--bg-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--bg-y", `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    const card = cardRef.current;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    card.style.setProperty("--x", `50%`);
    card.style.setProperty("--y", `50%`);
    card.style.setProperty("--bg-x", "50%");
    card.style.setProperty("--bg-y", "50%");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-black border border-white/10 transition-all duration-500 ease-out transform-gpu",
        className
      )}
      {...props}
    >
      <div className="relative z-10 h-full w-full">{children}</div>

      {/* Holographic Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `
            radial-gradient(
              circle at var(--x, 50%) var(--y, 50%),
              rgba(255, 255, 255, 0.1) 0%,
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Rainbow Holographic Effect */}
      <div 
        className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-60 mix-blend-color-dodge"
        style={{
            background: "linear-gradient(135deg, rgba(255,0,0,0.5), rgba(0,255,0,0.5), rgba(0,0,255,0.5), rgba(255,0,255,0.5), rgba(255,255,0,0.5), rgba(0,255,255,0.5))",
            filter: "blur(20px)",
            maskImage: "radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 40%, transparent 70%)",
        }}
      />
      
      {/* Dynamic Sheen */}
      <div
        className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"
      />
    </div>
  );
};

export default HolographicCard;
