import { Layout } from "@/components/layout";
import { VideoInput } from "@/components/video-input";
import { VibeSelector } from "@/components/vibe-selector";
import { VoiceSelector } from "@/components/voice-selector";
import { SportSelector } from "@/components/sport-selector";
import { LiveCommentary } from "@/components/live-commentary";
import { CyberneticGridShader } from "@/components/cybernetic-grid-shader";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { CommentaryShowcase } from "@/components/commentary-showcase";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Studio() {
  const [step, setStep] = useState<"upload" | "sport" | "vibe" | "voice" | "live">("upload");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [sportId, setSportId] = useState<string | null>(null);
  const [vibeId, setVibeId] = useState<string | null>(null);
  const [voiceId, setVoiceId] = useState<string | null>(null);

  const handleVideoSelect = (url: string) => {
    setVideoUrl(url);
    setStep("sport");
  };

  const handleSportSelect = (id: string) => {
    setSportId(id);
    setStep("vibe");
  };

  const handleVibeSelect = (id: string) => {
    setVibeId(id);
    setStep("voice");
  };

  const handleVoiceSelect = (id: string) => {
    setVoiceId(id);
    setStep("live");
  };

  const handleReset = () => {
    setStep("upload");
    setVideoUrl(null);
    setSportId(null);
    setVibeId(null);
    setVoiceId(null);
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto relative">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center min-h-[60vh] relative z-10"
            >
              <VideoInput onVideoSelect={handleVideoSelect} />
              <CommentaryShowcase />
            </motion.div>
          )}

          {step === "sport" && (
            <motion.div
              key="sport"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-0 flex flex-col items-center justify-center pt-24 pb-12 px-4"
            >
              <DottedSurface />
              <div className="relative z-10 w-full h-full max-w-6xl mx-auto flex flex-col items-center justify-center">
                <SportSelector selectedSport={sportId} onSelect={handleSportSelect} />
              </div>
            </motion.div>
          )}

          {step === "vibe" && (
            <motion.div
              key="vibe"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-0 flex flex-col items-center justify-center pt-24 pb-12 px-4"
              style={{ cursor: "none" }}
            >
              <style>{`
                #root .fixed.inset-0 * {
                  cursor: none !important;
                }
              `}</style>
              <CyberneticGridShader />
              <div className="relative z-10 w-full h-full max-w-6xl mx-auto flex flex-col items-center justify-center">
                <VibeSelector selectedVibe={vibeId} onSelect={handleVibeSelect} />
              </div>
            </motion.div>
          )}

          {step === "voice" && (
            <motion.div
              key="voice"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-0 flex flex-col items-center justify-center pt-24 pb-12 px-4"
              style={{ cursor: "none" }}
            >
              <style>{`
                #root .fixed.inset-0 * {
                  cursor: none !important;
                }
              `}</style>
              <CyberneticGridShader />
              <div className="relative z-10 w-full h-full max-w-6xl mx-auto flex flex-col items-center justify-center">
                <VoiceSelector selectedVoice={voiceId} onSelect={handleVoiceSelect} />
              </div>
            </motion.div>
          )}

          {step === "live" && vibeId && videoUrl && (
            <motion.div
              key="live"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <LiveCommentary vibeId={vibeId} videoUrl={videoUrl} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
