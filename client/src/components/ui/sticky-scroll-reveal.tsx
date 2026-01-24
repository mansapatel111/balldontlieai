"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
  onSelect,
  vibes
}: {
  content: {
    title: string;
    description: string | React.ReactNode;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
  onSelect?: (id: string) => void;
  vibes?: any[];
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // target: ref,
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "transparent",
    "transparent", 
    "transparent",
  ];
  
  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="h-[30rem] overflow-y-auto flex flex-col lg:flex-row justify-center relative space-x-0 lg:space-x-10 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6 lg:p-10 no-scrollbar"
      ref={ref}
    >
      <div className="div relative flex items-start px-4 w-full lg:w-1/2">
        <div className="max-w-2xl w-full">
          {content.map((item, index) => (
            <div 
              key={item.title + index} 
              className="my-10 lg:my-20 cursor-pointer group"
              onClick={() => {
                if (onSelect && vibes) {
                  onSelect(vibes[index].id);
                }
              }}
            >
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl lg:text-3xl font-bold text-white font-display italic tracking-tight uppercase group-hover:text-neon-blue transition-colors"
              >
                {item.title}
              </motion.h2>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-lg lg:text-xl text-white/80 max-w-sm mt-4 font-display leading-relaxed"
              >
                {item.description}
              </motion.div>
              
              {/* Mobile Content View */}
              <div className={cn(
                "block lg:hidden mt-4 h-60 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative",
                contentClassName
              )}>
                 {item.content}
              </div>
            </div>
          ))}
          <div className="h-20 lg:h-40" />
        </div>
      </div>
      <motion.div
        className={cn(
          "hidden lg:block h-60 w-80 rounded-2xl sticky top-10 overflow-hidden border border-white/10 shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300",
          contentClassName
        )}
        onClick={() => {
          if (onSelect && vibes) {
            onSelect(vibes[activeCard].id);
          }
        }}
      >
        {content[activeCard].content ?? null}
      </motion.div>
    </motion.div>
  );
};
