import { motion } from "framer-motion";
import { VIBES } from "@/lib/constants";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import useSound from "use-sound";
import { FlippingCard } from "@/components/ui/flipping-card";

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
              onMouseEnter={() => playHover()}
            >
              <FlippingCard 
                width={400}
                height={250}
                className={cn(
                  "cursor-pointer",
                  isSelected && "ring-4 ring-primary rounded-xl"
                )}
                onClick={() => {
                  playSelect();
                  onSelect(vibe.id);
                }}
                frontContent={
                  <div className="flex flex-col items-center justify-center h-full p-8 relative">
                     {/* Ambient Glow */}
                     <div 
                        className={cn(
                            "absolute inset-0 opacity-20 blur-3xl transition-colors duration-500 -z-10",
                        )}
                        style={{
                            background: `radial-gradient(circle at center, ${vibe.color}, transparent 70%)`
                        }}
                    />
                    
                    <div className={cn(
                      "p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md mb-4 shadow-xl",
                      isSelected ? "text-primary border-primary/50" : "text-white"
                    )}>
                      {Icon && <Icon className="w-12 h-12" />}
                    </div>
                    
                    <h3 className={cn(
                      "text-4xl font-display font-bold uppercase italic tracking-wide text-center",
                      isSelected ? "text-white text-glow" : "text-white/90"
                    )}>
                      {vibe.title}
                    </h3>

                    {isSelected && (
                        <div className="mt-4 px-4 py-1 rounded-full bg-primary text-black text-sm font-bold uppercase tracking-wider animate-pulse">
                            Selected
                        </div>
                    )}
                  </div>
                }
                backContent={
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center relative bg-black/50">
                     {/* Ambient Glow */}
                     <div 
                        className={cn(
                            "absolute inset-0 opacity-10 blur-3xl transition-colors duration-500 -z-10",
                        )}
                        style={{
                            background: `radial-gradient(circle at center, ${vibe.color}, transparent 70%)`
                        }}
                    />

                    <div className="mb-4 text-sm font-bold text-white/60 uppercase tracking-widest">
                        Vibe: {vibe.vibe}
                    </div>

                    <p className="text-lg text-white/90 font-medium leading-relaxed">
                      {vibe.description}
                    </p>

                    <div className="mt-6 text-primary text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        Click to Select <Icons.ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                }
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
