import { motion } from "framer-motion";
import { MessageCircle, Heart, Share2 } from "lucide-react";

interface Comment {
  id: number;
  user: string;
  text: string;
  likes: string;
  vibe: string;
}

const DEMO_COMMENTS: Comment[] = [
  {
    id: 1,
    user: "@ballknows",
    text: "Bro thinks he's Curry with that airball 💀 The rim is strictly a suggestion for this man.",
    likes: "24K",
    vibe: "Ruthless"
  },
  {
    id: 2,
    user: "@ankle_breaker",
    text: "Gravity just called, it wants its center of mass back. Somebody get a map for those feet!",
    likes: "12K",
    vibe: "Hype"
  },
  {
    id: 3,
    user: "@bench_warmer",
    text: "Coach is definitely putting him in the transfer portal after that possession. 0 IQ play.",
    likes: "15K",
    vibe: "Savage"
  },
  {
    id: 4,
    user: "@rizz_lord",
    text: "His shooting form has zero rizz. Pure NPC energy on the court right now. 📉",
    likes: "42K",
    vibe: "Meme"
  },
  {
    id: 5,
    user: "@stat_muse_burner",
    text: "He's shooting 12% from the field. I've seen better percentages on a battery saver mode.",
    likes: "19K",
    vibe: "Analytical"
  },
  {
    id: 6,
    user: "@hoop_god_99",
    text: "Someone check the controller, I think his X button is broken. PASS THE BALL! 😡",
    likes: "27K",
    vibe: "Rage"
  }
];

export function CommentaryShowcase() {
  return (
    <div className="w-full max-w-7xl mx-auto mt-16 px-4 pb-20 overflow-hidden relative min-h-[600px]">
      <div className="text-center mb-10 relative z-10">
        <h3 className="text-3xl font-display font-bold text-white uppercase italic tracking-tight mb-2">
          Hall of Flame
        </h3>
        <p className="text-white/60 text-lg">Top rated roasts from the community</p>
      </div>

      <div className="relative w-full h-[600px]">
        {DEMO_COMMENTS.map((comment, idx) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, scale: 0.8, x: Math.random() * 100 - 50, y: Math.random() * 100 + 50 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -20, 0],
              rotate: [0, idx % 2 === 0 ? 2 : -2, 0]
            }}
            transition={{ 
              opacity: { duration: 0.5, delay: idx * 0.1 },
              scale: { duration: 0.5, delay: idx * 0.1 },
              y: { 
                repeat: Infinity, 
                duration: 4 + Math.random() * 2, 
                ease: "easeInOut",
                delay: Math.random() * 2 
              },
              rotate: {
                repeat: Infinity,
                duration: 5 + Math.random() * 3,
                ease: "easeInOut",
                delay: Math.random() * 2
              }
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 80 + 5}%`,
              left: `${Math.random() * 80 + 5}%`,
              zIndex: Math.floor(Math.random() * 10)
            }}
            className="w-full max-w-[320px] rounded-xl p-5 backdrop-blur-md shadow-xl hover:scale-105 hover:z-50 transition-all duration-300 cursor-pointer border bg-black/40 border-white/10 hover:bg-white/10"
          >
            {/* Social Style Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${
                  idx % 3 === 0 ? 'from-purple-500 to-pink-500' : 
                  idx % 3 === 1 ? 'from-blue-500 to-cyan-500' : 
                  'from-orange-500 to-red-500'
                }`}>
                  {comment.user[1].toUpperCase()}
                </div>
                <span className="text-xs font-mono text-white/70">{comment.user}</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-white/10 px-2 py-1 rounded-full text-white/80 border border-white/5">
                {comment.vibe}
              </span>
            </div>
            
            <p className="text-sm font-medium leading-relaxed mb-4 text-white/90">
              "{comment.text}"
            </p>

            <div className="flex items-center gap-4 text-white/40 text-xs border-t border-white/5 pt-3">
              <div className="flex items-center gap-1 hover:text-pink-400 transition-colors">
                <Heart className="w-3.5 h-3.5" />
                <span>{comment.likes}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Reply</span>
              </div>
              <div className="flex items-center gap-1 hover:text-white transition-colors ml-auto">
                <Share2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}