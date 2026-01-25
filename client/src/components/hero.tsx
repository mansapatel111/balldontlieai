
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import TextVideoMask from "@/components/text-video-mask";
import { GlowingShadow } from "@/components/glowing-shadow";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden">






      <div className="container px-4 relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">

          {/* Main Video Mask Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-5xl mb-16"
            style={{ height: '400px' }}
          >
            <TextVideoMask
              useVideoFile={true}
              videoFile="/nfl.mov"
              videoUrl=""
              text="BALL DON'T LIE"
              font={{
                fontSize: "110",
                fontFamily: "Inter",
                fontWeight: 900,
                fontStyle: "normal",
                letterSpacing: "-0.02em",
                lineHeight: "1",
              }}
              textColor="#FFFFFF"
              backgroundColor="transparent"
              autoplay={true}
              loop={true}
              muted={true}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <GlowingShadow>
              <Link href="/studio" className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-display font-bold text-lg backdrop-blur-sm transition-colors group uppercase">
                  Start Balling <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </GlowingShadow>

            <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-display font-bold text-lg backdrop-blur-sm transition-colors flex items-center gap-2 group uppercase">
              <Play className="w-5 h-5 fill-current" />
              Watch Demo
            </button>
          </motion.div>

          {/* Floating UI Elements Decor */}
          <div className="absolute -z-10 w-full h-full top-0 left-0 pointer-events-none">

            {/* LEFT – Role Card (top-left quadrant) */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-10 md:left-20 bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 w-52 hidden lg:block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs font-bold text-white">Rizz Lord</div>
              </div>
              <div className="h-2 w-4/5 bg-white/10 rounded-full mb-2" />
              <div className="h-2 w-2/3 bg-white/10 rounded-full" />
            </motion.div>

            {/* LEFT – Vibe Meter (lower-left quadrant) */}
            <motion.div 
              animate={{ y: [0, 16, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/3 left-12 md:left-24 bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 w-44 hidden lg:block"
            >
              <div className="text-[10px] uppercase tracking-widest text-purple-400 mb-2">
                Vibe Level
              </div>
              <div className="flex gap-1">
                <div className="h-2 w-6 bg-purple-500 rounded-full" />
                <div className="h-2 w-6 bg-purple-400 rounded-full" />
                <div className="h-2 w-6 bg-purple-300 rounded-full" />
              </div>
            </motion.div>

            {/* RIGHT – Transcript Card (top-right quadrant) */}
            <motion.div 
              animate={{ y: [0, 24, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/4 right-10 md:right-20 bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 w-56 hidden lg:block"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-green-400">LIVE</span>
                <div className="flex gap-1">
                  <span className="w-1 h-3 bg-green-400 animate-pulse" />
                  <span className="w-1 h-2 bg-green-400 animate-pulse delay-75" />
                  <span className="w-1 h-4 bg-green-400 animate-pulse delay-150" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                "Bro thinks he's the main character 💀"
              </p>
            </motion.div>

            {/* RIGHT – Stat / Heat Card (bottom-right quadrant) */}
            <motion.div 
              animate={{ y: [0, -18, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              className="absolute bottom-1/4 right-14 md:right-28 bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 w-48 hidden lg:block"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-orange-400">HOT TAKE</span>
                <span className="text-xs text-white/40">🔥 47K</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full mb-2" />
              <div className="h-2 w-3/4 bg-white/10 rounded-full" />
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
