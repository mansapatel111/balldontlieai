import { motion } from "framer-motion";
import { VIBES } from "@/lib/constants";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import useSound from "use-sound";
import HolographicCard from "@/components/ui/holographic-card";

interface VibeSelectorProps {
  selectedVibe: string | null;
  onSelect: (id: string) => void;
}

export function VibeSelector({ selectedVibe, onSelect }: VibeSelectorProps) {
  const [playHover] = useSound("/sounds/hover.mp3", { volume: 0.5 });
  const [playSelect] = useSound("/sounds/select.mp3", { volume: 0.5 });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-4 mb-12 flex-shrink-0">
        <h2 className="text-4xl font-display font-bold text-white uppercase italic tracking-tighter text-glow">
          Select Your Personality
        </h2>
        <p className="text-white/60 font-display text-lg">
          Choose the vibe for your commentator
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {VIBES.map((vibe, idx) => {
          const Icon = (Icons as any)[vibe.icon];
          const isSelected = selectedVibe === vibe.id;

          return (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0, scale: 0.9, rotateX: 90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ 
                delay: idx * 0.1, 
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              onClick={() => {
                playSelect();
                onSelect(vibe.id);
              }}
              onMouseEnter={() => playHover()}
              className="perspective-1000 group/flip"
            >
              <div className="relative w-full h-64 transition-transform duration-700 transform-style-3d group-hover/flip:rotate-y-180">
                {/* Front Face */}
                <div className="absolute inset-0 backface-hidden">
                  <HolographicCard 
                    className={cn(
                      "h-full w-full cursor-pointer p-8 flex flex-col items-center justify-center border-2 bg-black/80 backdrop-blur-xl text-center",
                      isSelected 
                        ? "border-primary shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)] ring-2 ring-primary/50" 
                        : "border-white/10 hover:border-white/30"
                    )}
                    style={{
                        // @ts-ignore
                        "--vibe-color": vibe.color
                    }}
                  >
                     <div className={cn(
                        "p-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 transition-colors duration-300",
                        isSelected ? "bg-primary/20 border-primary/50 text-primary" : "text-white/80 group-hover:text-white"
                    )}>
                        {Icon && <Icon className="w-12 h-12" />}
                    </div>

                    <h3 className={cn(
                        "text-3xl font-display font-bold uppercase italic tracking-wide transition-colors duration-300",
                         isSelected ? "text-white text-glow-sm" : "text-white/90"
                    )}>
                        {vibe.title}
                    </h3>

                    {/* Ambient Glow */}
                    <div 
                        className={cn(
                            "absolute inset-0 opacity-20 blur-3xl transition-colors duration-500 -z-10",
                        )}
                        style={{
                            background: `radial-gradient(circle at center, ${vibe.color}, transparent 70%)`
                        }}
                    />
                  </HolographicCard>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <HolographicCard 
                    className={cn(
                      "h-full w-full cursor-pointer p-8 flex flex-col items-start justify-center border-2 bg-black/90 backdrop-blur-xl",
                      isSelected 
                        ? "border-primary shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)] ring-2 ring-primary/50" 
                        : "border-white/10 hover:border-white/30"
                    )}
                    style={{
                        // @ts-ignore
                        "--vibe-color": vibe.color
                    }}
                  >
                    <div className="space-y-4 relative z-10 w-full text-center">
                        <div className="text-sm font-bold uppercase tracking-widest text-white/50 mb-2">
                           Vibe Check
                        </div>
                        <p className="text-white/90 text-lg font-medium leading-relaxed">
                            {vibe.description}
                        </p>
                        {isSelected && (
                            <div className="inline-block px-4 py-1.5 rounded-full bg-primary text-black text-xs font-bold uppercase tracking-wider animate-pulse mt-4">
                                Selected
                            </div>
                        )}
                    </div>

                    {/* Ambient Glow */}
                    <div 
                        className={cn(
                            "absolute inset-0 opacity-20 blur-3xl transition-colors duration-500 -z-10",
                        )}
                        style={{
                            background: `radial-gradient(circle at center, ${vibe.color}, transparent 70%)`
                        }}
                    />
                  </HolographicCard>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
