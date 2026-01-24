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
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-display font-bold text-white">Select Personality</h2>
        <p className="text-muted-foreground">Choose who ruins your video</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {VIBES.map((vibe, idx) => {
          const Icon = (Icons as any)[vibe.icon];
          const isSelected = selectedVibe === vibe.id;

          return (
            <motion.button
              key={vibe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelect(vibe.id)}
              className={cn(
                "relative h-64 rounded-2xl p-6 flex flex-col items-center text-center justify-between transition-all duration-300 border backdrop-blur-sm overflow-hidden group text-left",
                isSelected 
                  ? "border-transparent ring-2 ring-offset-2 ring-offset-background scale-105 z-10"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1"
              )}
              style={{
                borderColor: isSelected ? vibe.color : undefined,
                boxShadow: isSelected ? `0 0 30px -10px ${vibe.color}` : undefined,
                "--vibe-color": vibe.color
              } as any}
            >
              {/* Background Gradient for Selected State */}
              {isSelected && (
                <div className={`absolute inset-0 bg-gradient-to-br ${vibe.gradient} opacity-20`} />
              )}
              
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors",
                isSelected ? "bg-white/20 text-white" : "bg-white/5 text-muted-foreground group-hover:text-white"
              )}>
                {Icon && <Icon className="w-6 h-6" />}
              </div>

              <div className="relative z-10 w-full">
                <h3 className={cn(
                  "font-display font-bold text-xl mb-2 transition-colors",
                  isSelected ? "text-white" : "text-white/80 group-hover:text-white"
                )}>
                  {vibe.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-snug">
                  {vibe.description}
                </p>
              </div>

              {isSelected && (
                <motion.div
                  layoutId="selection-indicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
