import { cn } from "@/lib/utils";
import React from "react";

interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  rotate?: "x" | "y";
}

export default function FlipCard({
  frontContent,
  backContent,
  rotate = "y",
  className,
  ...props
}: FlipCardProps) {
  const rotationClass = {
    x: ["group-hover:[transform:rotateX(180deg)]", "[transform:rotateX(180deg)]"],
    y: ["group-hover:[transform:rotateY(180deg)]", "[transform:rotateY(180deg)]"],
  };
  const self = rotationClass[rotate];

  return (
    <div className={cn("group h-80 w-64 [perspective:1000px]", className)} {...props}>
      <div
        className={cn(
          "relative h-full w-full transition-all duration-1000 [transform-style:preserve-3d]",
          self[0],
        )}
      >
        {/* Front */}
        <div className="absolute h-full w-full [backface-visibility:hidden]">
          {frontContent}
        </div>

        {/* Back */}
        <div
          className={cn(
            "absolute h-full w-full [backface-visibility:hidden]",
            self[1],
          )}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
}
