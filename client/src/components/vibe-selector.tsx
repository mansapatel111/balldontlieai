import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { VIBES } from "@/lib/constants";
import * as Icons from "lucide-react";

export function VibeSelector({ selectedVibe, onSelect }: { selectedVibe: string | null, onSelect: (id: string) => void }) {
  const content = VIBES.map((vibe) => {
    const Icon = (Icons as any)[vibe.icon];
    return {
      title: vibe.title,
      description: vibe.description,
      content: (
        <div 
          className="h-full w-full flex items-center justify-center text-white cursor-pointer group transition-all"
          onClick={() => onSelect(vibe.id)}
          style={{
            background: `linear-gradient(to bottom right, ${vibe.gradient.replace('from-', 'var(--color-').replace(' to-', '), var(--color-').replace(')', '))')}` // Fallback approximation or custom logic needed if using Tailwind classes in JS directly
            // For now, let's use a simple background logic or pass the classname to a child
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${vibe.gradient} opacity-80`} />
          <div className="relative z-10 flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                {Icon && <Icon className="w-8 h-8 text-white" />}
             </div>
             <button className="px-6 py-2 bg-white text-black font-display font-bold italic uppercase rounded-full hover:scale-105 transition-transform">
               Select {vibe.title}
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
