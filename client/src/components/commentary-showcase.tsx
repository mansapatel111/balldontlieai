import { motion } from "framer-motion";
import { MessageCircle, Heart, Share2 } from "lucide-react";

const DEMO_COMMENTS = [
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
    user: "@ref_fan_1",
    text: "Even the cameraman got faked out. That crossover belongs in a museum of disrespect.",
    likes: "8.5K",
    vibe: "Analytical"
  },
  {
    id: 4,
    user: "@bench_warmer",
    text: "Coach is definitely putting him in the transfer portal after that possession. 0 IQ play.",
    likes: "15K",
    vibe: "Savage"
  }
];

export function CommentaryShowcase() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-16 px-4">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-display font-bold text-white uppercase italic tracking-tight">
          Hall of Flame
        </h3>
        <p className="text-white/60">Top rated roasts from the community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_COMMENTS.map((comment, idx) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 + 0.5 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                  {comment.user[1].toUpperCase()}
                </div>
                <span className="text-xs font-mono text-white/70">{comment.user}</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-white/10 px-2 py-1 rounded-full text-white/80">
                {comment.vibe}
              </span>
            </div>
            
            <p className="text-sm text-white/90 font-medium leading-relaxed mb-4">
              "{comment.text}"
            </p>

            <div className="flex items-center gap-4 text-white/40 text-xs">
              <div className="flex items-center gap-1 hover:text-pink-400 transition-colors cursor-pointer">
                <Heart className="w-3 h-3" />
                <span>{comment.likes}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-purple-400 transition-colors cursor-pointer">
                <MessageCircle className="w-3 h-3" />
                <span>Reply</span>
              </div>
              <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer ml-auto">
                <Share2 className="w-3 h-3" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
