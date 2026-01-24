import { motion } from "framer-motion";
import { Mic, Volume2, Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useSound from "use-sound";

interface VoiceSelectorProps {
  selectedVoice: string | null;
  onSelect: (id: string) => void;
}

const VOICES = [
  {
    id: "adam",
    title: "Adam",
    description: "Deep, resonant, authoritative but chill.",
    icon: "Mic",
    preview: "/voices/adam.mp3"
  },
  {
    id: "charlie",
    title: "Charlie",
    description: "High energy, fast-paced, excitement overload.",
    icon: "Volume2",
    preview: "/voices/charlie.mp3"
  },
  {
    id: "bella",
    title: "Bella",
    description: "Sassy, sharp, clear articulation with attitude.",
    icon: "Sparkles",
    preview: "/voices/bella.mp3"
  },
  {
    id: "drake",
    title: "Drake",
    description: "Smooth, melodic, laid back flow.",
    icon: "Wand2",
    preview: "/voices/drake.mp3"
  }
];

export function VoiceSelector({ selectedVoice, onSelect }: VoiceSelectorProps) {
  const [playHover] = useSound("/sounds/hover.mp3", { volume: 0.5 });

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col items-center">
      <div className="text-center space-y-2 mb-12 flex-shrink-0">
        <h2 className="text-3xl font-display font-bold text-white uppercase italic tracking-tight">Select Your Voice</h2>
        <p className="text-white/60 font-display text-lg">Who should narrate the chaos?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {VOICES.map((voice, idx) => {
          const isSelected = selectedVoice === voice.id;

          return (
            <motion.button
              key={voice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelect(voice.id)}
              onMouseEnter={() => playHover()}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "relative rounded-2xl p-6 flex items-center gap-6 text-left transition-all duration-300 border backdrop-blur-sm overflow-hidden group h-32 w-full",
                isSelected 
                  ? "border-transparent ring-2 ring-white z-10 bg-white/10"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              )}
            >
              {/* Background Glow for Selected State */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              )}
              
              <div className={cn(
                "flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-colors border",
                isSelected 
                  ? "bg-white text-black border-transparent" 
                  : "bg-black/20 text-white/70 border-white/10 group-hover:text-white group-hover:border-white/30"
              )}>
                {voice.id === "adam" && <Mic className="w-8 h-8" />}
                {voice.id === "charlie" && <Volume2 className="w-8 h-8" />}
                {voice.id === "bella" && <Sparkles className="w-8 h-8" />}
                {voice.id === "drake" && <Wand2 className="w-8 h-8" />}
              </div>

              <div className="relative z-10 flex-1">
                <div className="flex items-center justify-between mb-1">
                    <h3 className={cn(
                    "font-display font-bold text-2xl uppercase italic transition-colors",
                    isSelected ? "text-white" : "text-white/80 group-hover:text-white"
                    )}>
                    {voice.title}
                    </h3>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                </div>
                
                <p className="text-sm text-muted-foreground leading-snug font-medium">
                  {voice.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

