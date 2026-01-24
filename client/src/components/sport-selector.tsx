import { motion } from "framer-motion";
import { Trophy, Globe, Activity, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import useSound from "use-sound";

interface SportSelectorProps {
  selectedSport: string | null;
  onSelect: (id: string) => void;
}

const SPORTS = [
  {
    id: "basketball",
    title: "Basketball",
    description: "Hoops, dunks, and ankle breakers.",
    price: "FREE",
    features: ["Court vision analysis", "Dunk ratings", "Crossover detection"],
    icon: "Trophy"
  },
  {
    id: "soccer",
    title: "Soccer",
    description: "The beautiful game's ugly moments.",
    price: "FREE",
    features: ["Flop detection", "Offside roasts", "Goal celebrations"],
    icon: "Globe"
  },
  {
    id: "football",
    title: "Football",
    description: "Gridiron gladiator fails.",
    price: "FREE",
    features: ["Touchdown dances", "Fumble analysis", "Hail Mary commentary"],
    icon: "Activity"
  },
  {
    id: "hockey",
    title: "Hockey",
    description: "Ice cold hits and misses.",
    price: "FREE",
    features: ["Fight commentary", "Slapshot analysis", "Goalie roasts"],
    icon: "Target"
  }
];

export function SportSelector({ selectedSport, onSelect }: SportSelectorProps) {
  const [playHover] = useSound("/sounds/hover.mp3", { volume: 0.5 });

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col items-center">
      <div className="text-center space-y-2 mb-12 flex-shrink-0">
        <h2 className="text-3xl font-display font-bold text-white uppercase italic tracking-tight">Pick Your Game</h2>
        <p className="text-white/60 font-display text-lg">What sport are we roasting today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {SPORTS.map((sport, idx) => {
          const isSelected = selectedSport === sport.id;
          const Icon = sport.id === "basketball" ? Trophy : sport.id === "soccer" ? Globe : sport.id === "football" ? Activity : Target;

          return (
            <motion.div
              key={sport.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelect(sport.id)}
              onMouseEnter={() => playHover()}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "relative rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer backdrop-blur-md",
                isSelected
                  ? "border-white bg-white/10 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
                  : "border-white/10 bg-black/40 hover:border-white/50 hover:bg-black/60"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border",
                         isSelected ? "bg-white text-black border-white" : "bg-white/5 text-white/70 border-white/10"
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {sport.title}
                        </h3>
                        <p className="text-sm text-white/60">
                            {sport.description}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xl font-bold text-white">
                        {sport.price}
                    </span>
                </div>
              </div>

              <ul className="space-y-2 mb-2">
                {sport.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-white/70"
                  >
                    <div className={cn("mr-2 h-1.5 w-1.5 rounded-full", isSelected ? "bg-white" : "bg-white/30")} />
                    {feature}
                  </li>
                ))}
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
