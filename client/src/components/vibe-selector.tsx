import { motion } from "framer-motion";
import { VIBES } from "@/lib/constants";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { StickyScroll } from "@/components/sticky-scroll-reveal";
import { CyberneticGridShader } from "@/components/cybernetic-grid-shader";

interface VibeSelectorProps {
  selectedVibe: string | null;
  onSelect: (id: string) => void;
}

export function VibeSelector({ selectedVibe, onSelect }: VibeSelectorProps) {
  // Transform VIBES into format for StickyScroll
  const content = VIBES.map((vibe) => {
    const Icon = (Icons as any)[vibe.icon];
    
    return {
      title: vibe.title,
      description: vibe.description,
      content: (
        <div 
          onClick={() => onSelect(vibe.id)}
          className={cn(
            "h-full w-full flex items-center justify-center text-white cursor-pointer relative overflow-hidden group transition-all duration-300",
            selectedVibe === vibe.id ? "ring-4 ring-white" : "hover:ring-2 hover:ring-white/50"
          )}
          style={{
            background: `linear-gradient(to bottom right, ${vibe.color.replace('var(', '').replace(')', '')}, #000)`,
          }}
        >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            <div className="relative z-10 flex flex-col items-center gap-4 p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                    {Icon && <Icon className="w-12 h-12 text-white" />}
                </div>
                <h3 className="text-3xl font-display font-bold italic uppercase">{vibe.title}</h3>
                <div className="px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full text-sm font-mono tracking-wider border border-white/20">
                    {vibe.vibe}
                </div>
            </div>
        </div>
      ),
    };
  });

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col relative">
      {/* Background Shader */}
      <CyberneticGridShader />
      
      <div className="text-center space-y-2 mb-8 flex-shrink-0 relative z-10">
        <h2 className="text-3xl font-display font-bold text-white uppercase italic tracking-tighter">Select Your Personality</h2>
        <p className="text-muted-foreground font-mono uppercase tracking-widest text-sm">Scroll to explore • Click card to select</p>
      </div>

      <div className="flex-1 min-h-0 relative z-10">
        <StickyScroll content={content} />
      </div>
    </div>
  );
}
