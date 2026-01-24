import { motion } from "framer-motion";
import { VIBES } from "@/lib/constants";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import useSound from "use-sound";

interface VibeSelectorProps {
  selectedVibe: string | null;
  onSelect: (id: string) => void;
}

export function VibeSelector({ selectedVibe, onSelect }: VibeSelectorProps) {
  const [playHover] = useSound("/sounds/hover.mp3", { volume: 0.5 });

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col items-center">
      <div className="text-center space-y-2 mb-8 flex-shrink-0">
        <h2 className="text-3xl font-display font-bold text-white uppercase italic tracking-tight">Select Your Personality</h2>
        <p className="text-white/60 font-display text-lg">Who is commenting on this mess?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full overflow-y-auto pr-2 pb-4">
        {VIBES.map((vibe, idx) => {
          const Icon = (Icons as any)[vibe.icon];
          const isSelected = selectedVibe === vibe.id;

          return (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelect(vibe.id)}
              onMouseEnter={() => playHover()}
              className={cn(
                "relative rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer backdrop-blur-md",
                isSelected
                  ? "border-white bg-white/10 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
                  : "border-white/10 bg-black/40 hover:border-white/50 hover:bg-black/60"
              )}
              style={{
                borderColor: isSelected ? vibe.color : undefined,
                boxShadow: isSelected ? `0 0 30px -10px ${vibe.color}` : undefined
              }}
            >
               <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border transition-colors",
                         isSelected ? "bg-white text-black border-transparent" : "bg-white/5 text-white/70 border-white/10"
                    )}>
                        {Icon && <Icon className="w-6 h-6" />}
                    </div>
                    <div>
                        <h3 className={cn("text-xl font-bold transition-colors", isSelected ? "text-white" : "text-white/90")}>
                            {vibe.title}
                        </h3>
                        <p className="text-sm text-white/60">
                           Vibe: {vibe.vibe}
                        </p>
                    </div>
                </div>
              </div>

              <p className="text-sm text-white/70 mb-4 leading-relaxed">
                  {vibe.description}
              </p>

              {/* Using Features style from ModalPricing */}
              <ul className="space-y-2">
                  <li className="flex items-center text-sm text-white/60">
                    <div className={cn("mr-2 h-1.5 w-1.5 rounded-full", isSelected ? "bg-white" : "bg-white/30")} />
                    Unique commentary style
                  </li>
                  <li className="flex items-center text-sm text-white/60">
                    <div className={cn("mr-2 h-1.5 w-1.5 rounded-full", isSelected ? "bg-white" : "bg-white/30")} />
                    Reactive sound effects
                  </li>
              </ul>

              {isSelected && (
                <div className="absolute top-4 right-4">
                    <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                        <motion.svg 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-3 w-3 text-black" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth={3}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                    </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
