import { motion } from "framer-motion";
import { VIBES } from "@/lib/constants";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface VibeSelectorProps {
  selectedVibe: string | null;
  onSelect: (id: string) => void;
}

export function VibeSelector({ selectedVibe, onSelect }: VibeSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
      <div className="text-center space-y-2 mb-8 flex-shrink-0">
        <h2 className="text-2xl font-display font-bold text-white uppercase italic">Select Your Personality</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0">
        {VIBES.map((vibe, idx) => {
          const Icon = (Icons as any)[vibe.icon];
          const isSelected = selectedVibe === vibe.id;

          return (
            <motion.button
              key={vibe.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelect(vibe.id)}
              className={cn(
                "relative w-full rounded-2xl p-6 flex items-start gap-6 text-left transition-all duration-300 border backdrop-blur-sm overflow-hidden group",
                isSelected 
                  ? "border-transparent ring-2 ring-offset-2 ring-offset-background z-10 bg-white/10"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              )}
              style={{
                borderColor: isSelected ? vibe.color : undefined,
                boxShadow: isSelected ? `0 0 30px -10px ${vibe.color}` : undefined,
                "--vibe-color": vibe.color
              } as any}
            >
              {/* Background Gradient for Selected State */}
              {isSelected && (
                <div className={`absolute inset-0 bg-gradient-to-r ${vibe.gradient} opacity-10`} />
              )}
              
              <div className={cn(
                "flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-colors mt-1",
                isSelected ? "bg-white/20 text-white" : "bg-white/5 text-muted-foreground group-hover:text-white"
              )}>
                {Icon && <Icon className="w-8 h-8" />}
              </div>

              <div className="relative z-10 flex-1">
                <h3 className={cn(
                  "font-display font-bold text-xl mb-1 transition-colors flex items-center gap-2",
                  isSelected ? "text-white" : "text-white/80 group-hover:text-white"
                )}>
                  {vibe.title}
                </h3>
                
                <div className="mb-2 text-sm font-bold text-white/90 uppercase tracking-wide">
                  Vibe: {vibe.vibe}
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {vibe.description}
                </p>
              </div>

              {isSelected && (
                <motion.div
                  layoutId="selection-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
