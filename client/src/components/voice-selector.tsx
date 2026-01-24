import { motion } from "framer-motion";
import { Mic, Volume2, Sparkles, Wand2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import useSound from "use-sound";
import { GlareCard } from "@/components/ui/glare-card";

// Import voice images
import nickiImg from "@/assets/voices/nicki.png";
import spongebobImg from "@/assets/voices/spongebob.png";
import ghostfaceImg from "@/assets/voices/ghostface.png";
import jamesImg from "@/assets/voices/james.png";
import randomImg from "@/assets/voices/random.png";

interface VoiceSelectorProps {
  selectedVoice: string | null;
  onSelect: (id: string) => void;
}

const VOICES = [
  {
    id: "nicki",
    title: "Nicki",
    description: "Sassy, fast-paced rap flow with attitude.",
    image: nickiImg,
    preview: "/voices/nicki.mp3"
  },
  {
    id: "spongebob",
    title: "Spongebob",
    description: "High-pitched, enthusiastic, nautical nonsense.",
    image: spongebobImg,
    preview: "/voices/spongebob.mp3"
  },
  {
    id: "ghostface",
    title: "Ghostface",
    description: "Menacing, raspy, horror-movie chiller.",
    image: ghostfaceImg,
    preview: "/voices/ghostface.mp3"
  },
  {
    id: "james",
    title: "James",
    description: "Hey sisters! Energetic, dramatic makeup guru.",
    image: jamesImg,
    preview: "/voices/james.mp3"
  },
  {
    id: "random",
    title: "Random Celeb",
    description: "Feeling lucky? Let fate decide the narrator.",
    image: randomImg,
    preview: "/voices/random.mp3"
  }
];

export function VoiceSelector({ selectedVoice, onSelect }: VoiceSelectorProps) {
  const [playHover] = useSound("/sounds/hover.mp3", { volume: 0.5 });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-center space-y-2 mb-8 flex-shrink-0">
        <h2 className="text-4xl font-display font-bold text-white uppercase italic tracking-tight text-glow">
          Select Your Voice
        </h2>
        <p className="text-white/60 font-display text-lg">
          Who should narrate the chaos?
        </p>
      </div>

      <div className="w-full overflow-x-auto pb-12 pt-4 px-4 scrollbar-hide">
        <div className="flex gap-8 min-w-max px-8 mx-auto justify-center">
          {VOICES.map((voice, idx) => {
            const isSelected = selectedVoice === voice.id;

            return (
              <motion.div
                key={voice.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="relative group cursor-pointer"
                onClick={() => onSelect(voice.id)}
                onMouseEnter={() => playHover()}
              >
                <div className={cn(
                  "transition-all duration-300 transform",
                  isSelected ? "scale-105 ring-4 ring-primary ring-offset-4 ring-offset-black rounded-[48px]" : "hover:scale-105"
                )}>
                  <GlareCard className="flex flex-col items-center justify-end pb-8">
                    <img 
                      src={voice.image} 
                      alt={voice.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    
                    <div className="relative z-10 text-center px-4">
                      <h3 className="text-2xl font-bold text-white font-display uppercase italic tracking-wider mb-2 drop-shadow-lg">
                        {voice.title}
                      </h3>
                      <p className="text-white/80 text-xs font-medium max-w-[200px] mx-auto leading-relaxed drop-shadow-md">
                        {voice.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-primary text-black font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider animate-pulse">
                        Selected
                      </div>
                    )}
                  </GlareCard>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

