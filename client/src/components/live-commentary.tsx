import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { VIBES } from "@/lib/constants";
import { Play, Pause, SkipBack, Volume2, Share2, Download, RefreshCw, Loader2 } from "lucide-react";


interface LiveCommentaryProps {
  vibeId: string;
  videoUrl: string;
  voiceId: string | null;
  onReset: () => void;
}

export function LiveCommentary({ vibeId, videoUrl, voiceId, onReset }: LiveCommentaryProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const vibe = VIBES.find(v => v.id === vibeId);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    if (url === "sample") return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYouTubeId(videoUrl);

  // Fake commentary generation simulation
  useEffect(() => {
    if (!youtubeId) return;

    const w = window as any;

    // Load the IFrame Player API code asynchronously
    if (!w.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      if (w.YT && w.YT.Player) {
        playerRef.current = new w.YT.Player('youtube-player', {
          videoId: youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            mute: 1,
          },
        });
      }
    };

    if (w.YT && w.YT.Player) {
      initPlayer();
    } else {
      w.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [youtubeId]);

  // Handle play/pause sync
  const togglePlayPause = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      playerRef.current.playVideo();
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Fetch AI commentary and audio
  useEffect(() => {
    if (!youtubeId || !vibeId) return;

    const fetchCommentary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/process-with-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            videoId: youtubeId,
            personality: vibeId,
            voiceId: voiceId,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`API request failed: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Set the audio source
        if (data.audioUrl && audioRef.current) {
          audioRef.current.src = data.audioUrl;
        }

        // Display commentary in transcript
        if (data.commentary && Array.isArray(data.commentary)) {
          const commentaryTexts = data.commentary.map((item: any) => item.text);
          setTranscript(commentaryTexts);
        }
      } catch (err) {
        console.error('Error fetching commentary:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate commentary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommentary();
  }, [youtubeId, vibeId]);

  // Remove the fake commentary generation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.5));

      // Randomly add brainrot commentary
      if (Math.random() > 0.8) {
        const phrases = [
          "NAHHH BRO IS COOKING 💀",
          "WHAT IS THAT FORM???",
          "OHIO RIZZ UNLOCKED",
          "LITERAL NPC BEHAVIOR",
          "BLUD THINK HE HIM 😭",
          "ABSOLUTE CINEMA",
          "SKIBIDI TOILET ENERGY",
          "NO SHOT HE JUST DID THAT",
          "CHAT IS THIS REAL??",
          "MOGGED BY GRAVITY",
          "NEGATIVE AURA DETECTED"
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        setTranscript(prev => [...prev.slice(-4), randomPhrase]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Player Area */}
      <div className="lg:col-span-2 flex flex-col gap-4 h-full">
        <div className="relative flex-1 bg-black/40 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
          {/* YouTube Video Player */}
          {youtubeId ? (
            <div id="youtube-player" className="absolute inset-0 w-full h-full" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
              {/* Placeholder when no video */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20" />
              <span className="font-mono text-white/20 text-4xl font-bold uppercase tracking-widest animate-pulse">
                No Video Selected
              </span>
            </div>
          )}

          {/* Hidden audio element for AI commentary playback */}
          <audio ref={audioRef} className="hidden" />

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer overflow-hidden">
              <motion.div
                className="h-full bg-neon-purple"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5 ml-1" />}
                </button>
                <div className="text-white font-mono text-sm">00:{Math.floor(progress).toString().padStart(2, '0')} / 01:30</div>
              </div>

              <div className="flex items-center gap-4">
                <Volume2 className="text-white w-5 h-5" />
                <div className="w-24 h-1 bg-white/20 rounded-full">
                  <div className="w-2/3 h-full bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar / Commentary Feed */}
      <div className="h-full flex flex-col gap-4">
        {/* Status Card */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-white">Live Commentary</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono text-red-500 uppercase">Processing</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(135deg, ${vibe?.color}, transparent)` }}
            >
              {/* @ts-ignore */}
              {/* Using style for color injection */}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{vibe?.title} Mode</div>
              <div className="text-xs text-muted-foreground">Latency: 12ms</div>
            </div>
          </div>

          {/* Audio Viz Mock */}
          <div className="flex items-end justify-center gap-1 h-12 mb-2">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-neon-purple rounded-full"
                animate={{
                  height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 4,
                  opacity: isPlaying ? 1 : 0.3
                }}
                transition={{ duration: 0.2, repeat: Infinity, delay: i * 0.05 }}
              />
            ))}
          </div>
        </div>

        {/* Transcript Feed */}
        <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/40 to-transparent z-10" />

          <div className="space-y-4 overflow-y-auto h-full pb-4 flex flex-col justify-end">
            <AnimatePresence mode="popLayout">
              {transcript.map((text, i) => (
                <motion.div
                  key={`${i}-${text}`}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm"
                >
                  <p className="text-white font-medium text-lg leading-snug">"{text}"</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {transcript.length === 0 && (
              <div className="text-center text-muted-foreground py-10 opacity-50">
                Waiting for video playback...
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-colors">
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors border border-white/10"
          >
            <RefreshCw className="w-5 h-5" />
            New Video
          </button>
        </div>
      </div>
    </div>
  );
}
