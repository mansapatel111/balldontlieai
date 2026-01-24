import { motion } from "framer-motion";
import { VIBES } from "@/lib/constants";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import useSound from "use-sound";
import HolographicCard from "@/components/ui/holographic-card";
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl h-[600px]">
        {VIBES.map((vibe, idx) => {
          const Icon = (Icons as any)[vibe.icon];
          const isSelected = selectedVibe === vibe.id;

          const CardContent = ({ isBack = false }) => (
            <HolographicCard 
                className={cn(
                  "h-full w-full p-8 flex flex-col items-start justify-between border-2 bg-black/90 backdrop-blur-xl",
                  isSelected 
                    ? "border-primary shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)] ring-2 ring-primary/50" 
                    : "border-white/10"
                )}
                style={{
                    // @ts-ignore
                    "--vibe-color": vibe.color
                }}
            >
                {!isBack ? (
                    <>
                        <div className="flex w-full justify-between items-start">
                            <div className={cn(
                                "p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-colors duration-300",
                                isSelected ? "bg-primary/20 border-primary/50 text-primary" : "text-white/80 group-hover:text-white"
                            )}>
                                {Icon && <Icon className="w-8 h-8" />}
                            </div>
                            {isSelected && (
                                <div className="px-3 py-1 rounded-full bg-primary text-black text-xs font-bold uppercase tracking-wider animate-pulse">
                                    Selected
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 relative z-10 mt-auto">
                            <h3 className={cn(
                                "text-3xl font-display font-bold uppercase italic tracking-wide transition-colors duration-300",
                                isSelected ? "text-white text-glow-sm" : "text-white/90"
                            )}>
                                {vibe.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-white/40 border border-white/20 px-2 py-1 rounded">
                                    {vibe.vibe}
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col h-full justify-center items-center text-center space-y-6">
                         <h3 className="text-2xl font-display font-bold uppercase italic tracking-wide text-white/90">
                            {vibe.title}
                        </h3>
                        <p className="text-white/70 text-base font-medium leading-relaxed">
                            {vibe.description}
                        </p>
                        <button className="px-6 py-2 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-primary hover:scale-105 transition-all duration-200">
                            Select Vibe
                        </button>
                    </div>
                )}

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
          );

          return (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: idx * 0.1, 
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              onMouseEnter={() => playHover()}
              className="h-64"
            >
              <FlippingCard
                onClick={() => {
                    playSelect();
                    onSelect(vibe.id);
                }}
                frontContent={<CardContent isBack={false} />}
                backContent={<CardContent isBack={true} />}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
