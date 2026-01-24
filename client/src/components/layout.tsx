import { Link } from "wouter";
import { Zap } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden text-foreground selection:bg-primary selection:text-white">
      {/* Noise Overlay */}
      <div className="noise-bg" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
        <Link href="/" className="pointer-events-auto flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-purple blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
              <Zap className="w-8 h-8 text-white relative z-10 fill-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tighter italic text-white group-hover:text-neon-purple transition-colors">
              BALL DON'T LIE
            </span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-6">
          <a href="#" className="text-sm font-display font-bold italic tracking-tighter text-muted-foreground hover:text-white transition-colors hidden sm:block uppercase">
            About
          </a>
          <a href="#" className="text-sm font-display font-bold italic tracking-tighter text-muted-foreground hover:text-white transition-colors hidden sm:block uppercase">
            Showcase
          </a>
          <Link href="/studio" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-sm font-display font-bold italic tracking-tighter transition-all hover:scale-105 active:scale-95 text-white uppercase">
              Launch App
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
