import React from "react";
import { cn } from "@/lib/utils";

interface FlippingCardProps {
  className?: string;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  onClick?: () => void;
}

export function FlippingCard({
  className,
  frontContent,
  backContent,
  onClick
}: FlippingCardProps) {
  return (
    <div 
      className={cn("group perspective-1000 w-full h-full cursor-pointer", className)} 
      onClick={onClick}
    >
      <div className="relative h-full w-full transition-all duration-700 transform-style-3d group-hover:rotate-y-180">
        {/* Front Face */}
        <div className="absolute inset-0 h-full w-full backface-hidden">
            {frontContent}
        </div>
        
        {/* Back Face */}
        <div className="absolute inset-0 h-full w-full backface-hidden rotate-y-180">
            {backContent}
        </div>
      </div>
    </div>
  );
}
