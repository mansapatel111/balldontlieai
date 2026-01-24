import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { VIBES } from "@/lib/constants";
import * as Icons from "lucide-react";

export function VibeSelector({ selectedVibe, onSelect }: { selectedVibe: string | null, onSelect: (id: string) => void }) {
  const content = VIBES.map((vibe) => {
    const Icon = (Icons as any)[vibe.icon];
    return {
      title: vibe.title,
      description: (
        <div className="flex flex-col gap-4 items-start">
          <p>{vibe.description}</p>
          <button 
            onClick={() => onSelect(vibe.id)}
            className="lg:hidden px-6 py-2 bg-white text-black font-display font-bold italic uppercase rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            Select
          </button>
        </div>
      ),
      content: (
        <div 
          className="h-full w-full flex items-center justify-center text-white cursor-pointer group transition-all relative overflow-hidden"
          onClick={() => onSelect(vibe.id)}
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${vibe.gradient} opacity-80`} />
          
          {/* Icon/Box Visual */}
          <div className="relative z-10 flex flex-col items-center gap-4">
             <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-300">
                {Icon && <Icon className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />}
             </div>
             
             <button className="hidden lg:block px-6 py-2 bg-white text-black font-display font-bold italic uppercase rounded-full hover:scale-105 transition-transform shadow-lg">
               Select
             </button>
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-display font-bold text-white uppercase italic">Select Personality</h2>
        <p className="text-muted-foreground">Choose who ruins your video</p>
      </div>
      
      <StickyScroll content={content} />
    </div>
  );
}
