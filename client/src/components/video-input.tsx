import { motion } from "framer-motion";
import { Upload, Play, Check } from "lucide-react";
import { SAMPLE_VIDEOS } from "@/lib/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Eyes from "@/components/eyes";
import CircularCarousel from "@/components/circular-carousel";
import { extractYouTubeVideoId } from "./youtube-player";

interface VideoInputProps {
  onVideoSelect: (url: string) => void;
}

export function VideoInput({ onVideoSelect }: VideoInputProps) {
  const [url, setUrl] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        setError("");
        onVideoSelect(url);
      } else {
        setError("Please enter a valid YouTube URL");
      }
    }
  };

  const handleSampleSelect = (id: number, videoUrl: string) => {
    setSelectedId(id);
    setError("");
    onVideoSelect(videoUrl);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-2xl font-display font-bold text-white uppercase italic">Browse or Choose a Classic Game</h2>
          <Eyes tint="#09F" />
        </div>
      </div>

      {/* 3D Circular Carousel */}
      <div className="my-12" style={{ height: '400px' }}>
        <CircularCarousel
          images={SAMPLE_VIDEOS.map(video => ({
            src: video.thumbnail,
            alt: video.title
          }))}
          radius={320}
          itemWidth={260}
          itemHeight={160}
          perspective={1200}
          rotationSpeed={0.18}
          shaderEffect="none"
          tiltAngle={-18}
        />
      </div>

      {/* URL Input */}
      <motion.form 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleUrlSubmit}
        className="relative group"
      >
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Play className="w-5 h-5 text-muted-foreground group-focus-within:text-red-500 transition-colors" />
        </div>
        <input 
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          placeholder="Paste YouTube URL here..."
          className="w-full bg-black/20 border border-white/10 rounded-2xl py-6 pl-12 pr-40 text-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all backdrop-blur-sm"
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-white hover:bg-white/90 border border-white rounded-xl px-6 font-display font-bold text-black transition-all active:scale-95 uppercase shadow-lg"
        >
          Start Watching
        </button>
        {error && (
          <p className="absolute -bottom-6 left-0 text-sm text-red-400">{error}</p>
        )}
      </motion.form>

      <div className="flex items-center gap-4">
        <div className="h-px bg-white/5 flex-1" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">OR SELECT FEATURED</span>
        <div className="h-px bg-white/5 flex-1" />
      </div>

      {/* Sample Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SAMPLE_VIDEOS.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => handleSampleSelect(video.id, video.videoUrl)}
            className={cn(
              "group relative aspect-video rounded-xl overflow-hidden cursor-pointer border transition-all duration-300",
              selectedId === video.id 
                ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] ring-1 ring-white" 
                : "border-white/5 hover:border-white/20"
            )}
          >
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Play className="w-5 h-5 fill-white text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-sm font-bold text-white truncate">{video.title}</div>
              <div className="text-xs font-mono text-muted-foreground">{video.duration}</div>
            </div>
            
            {selectedId === video.id && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                <Check className="w-3 h-3 text-black" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
