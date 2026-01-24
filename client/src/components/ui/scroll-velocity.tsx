import { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: string;
  baseVelocity: number;
  className?: string;
}

function ParallaxText({ children, baseVelocity = 100, className }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const [repetitions, setRepetitions] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const calculateRepetitions = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.offsetWidth;
        const newRepetitions = Math.ceil(containerWidth / textWidth) + 2;
        setRepetitions(newRepetitions);
      }
    };

    calculateRepetitions();

    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [children]);

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap"
      ref={containerRef}
    >
      <motion.div className={cn("font-display font-bold uppercase text-nowrap flex whitespace-nowrap", className)} style={{ x }}>
        {Array.from({ length: repetitions }).map((_, i) => (
          <span key={i} ref={i === 0 ? textRef : null} className="block mr-8">
            {children} 
          </span>
        ))}
      </motion.div>
    </div>
  );
}

interface ScrollVelocityProps {
  texts: string[];
  velocity?: number;
  className?: string;
}

export function ScrollVelocity({ texts, velocity = 5, className }: ScrollVelocityProps) {
  return (
    <section className="relative w-full">
      {texts.map((text, i) => (
        <ParallaxText key={i} baseVelocity={velocity * (i % 2 === 0 ? 1 : -1)} className={className}>
          {text}
        </ParallaxText>
      ))}
    </section>
  );
}
