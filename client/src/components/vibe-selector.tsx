import { motion } from "framer-motion";
import { VIBES } from "@/lib/constants";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import useSound from "use-sound";
import FlipCard from "@/components/ui/flip-card";
import { GlareCard } from "@/components/ui/glare-card";

interface VibeSelectorProps {
  selectedVibe: string | null;
  onSelect: (id: string) => void;
}

export function VibeSelector({ selectedVibe, onSelect }: VibeSelectorProps) {
  const [playHover] = useSound("/sounds/hover.mp3", { volume: 0.5 });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-2 mb-8 flex-shrink-0">
        <h2 className="text-4xl font-display font-bold text-white uppercase italic tracking-tight text-glow">
          Select Your Personality
        </h2>
        <p className="text-white/60 font-display text-lg">
          Choose the commentator's vibe
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto w-full justify-items-center">
        {VIBES.map((vibe, idx) => {
          const Icon = (Icons as any)[vibe.icon];
          const isSelected = selectedVibe === vibe.id;

          return (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelect(vibe.id)}
              onMouseEnter={() => playHover()}
              className="relative cursor-pointer"
            >
              {isSelected && (
                <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-xl animate-pulse z-0" />
              )}
              
              <div className={cn(
                "relative z-10 transition-transform duration-300",
                isSelected && "scale-105"
              )}>
                <FlipCard
                  className="w-96 h-64" // Landscape aspect ratio
                  rotate="y"
                  frontContent={
                    <GlareCard className="flex flex-row items-center justify-between p-8 h-full border border-white/10 gap-6">
                      <div className="flex-1 text-left">
                        <h3 className="text-3xl font-bold text-white font-display uppercase italic tracking-wider mb-2 drop-shadow-lg">
                          {vibe.title}
                        </h3>
                        
                        <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-white/80 border border-white/5 inline-block mb-4">
                          {vibe.vibe}
                        </div>
                        
                        <div className="text-white/40 text-[10px] uppercase tracking-widest animate-pulse">
                          Hover for details
                        </div>
                      </div>

                      <div className={cn(
                        "w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center transition-colors shadow-lg shadow-black/50 border border-white/10",
                        isSelected ? "bg-white text-black" : "bg-black/40 text-white"
                      )}
                      style={{ boxShadow: isSelected ? `0 0 20px ${vibe.color}` : undefined }}
                      >
                        {Icon && <Icon className="w-12 h-12" />}
                      </div>
                    </GlareCard>
                  }
                  backContent={
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <Icons.Info className="w-6 h-6 text-white/80" />
                      </div>
                      <h4 className="text-xl font-bold text-white font-display uppercase italic">
                        The Analysis
                      </h4>
                      <p className="text-white/80 text-sm leading-relaxed font-medium">
                        {vibe.description}
                      </p>
                      
                      <div 
                        className="mt-4 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
                        style={{ backgroundColor: vibe.color, color: '#000' }}
                      >
                        Select Vibe
                      </div>
                    </div>
                  }
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
