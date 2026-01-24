import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { ShaderAnimation } from "@/components/shader-animation";
import { GlowingShadow } from "@/components/glowing-shadow";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <ShaderAnimation />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
      </div>

      <div className="container px-4 relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display italic text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 relative whitespace-nowrap"
          >
            BALL DON'T <span className="text-white">LIE</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white font-display font-bold italic max-w-3xl mb-12 leading-relaxed"
          >
            Transform any boring sports clip into high-energy brainrot commentary.
            <br className="hidden md:block" />
            Powered by unhinged AI models trained on pure internet chaos.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <GlowingShadow>
              <Link href="/studio" className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-display font-bold text-lg backdrop-blur-sm transition-colors group uppercase">
                  Start Rotting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </GlowingShadow>
            
            <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-display font-bold text-lg backdrop-blur-sm transition-colors flex items-center gap-2 group uppercase">
              <Play className="w-5 h-5 fill-current" />
              Watch Demo
            </button>
          </motion.div>

          {/* Floating UI Elements Decor */}
          <div className="absolute -z-10 w-full h-full top-0 left-0 pointer-events-none">
             <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-10 md:left-20 bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 w-48 hidden lg:block"
             >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-bold text-white">Rizz Lord</div>
                </div>
                <div className="h-2 w-3/4 bg-white/10 rounded-full mb-2" />
                <div className="h-2 w-1/2 bg-white/10 rounded-full" />
             </motion.div>

             <motion.div 
                animate={{ y: [0, 30, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-10 md:right-20 bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 w-56 hidden lg:block"
             >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-neon-green">TRANSCRIPT LIVE</span>
                  <div className="flex gap-1">
                    <span className="w-1 h-3 bg-neon-green animate-pulse" />
                    <span className="w-1 h-2 bg-neon-green animate-pulse delay-75" />
                    <span className="w-1 h-4 bg-neon-green animate-pulse delay-150" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  "Bro thinks he's the main character 💀💀"
                </p>
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
