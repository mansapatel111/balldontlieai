import { useEffect, useRef, useState } from "react";

// Extend Window interface to include YT
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

// YouTube IFrame API types
declare namespace YT {
  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): number;
    destroy(): void;
  }

  interface PlayerOptions {
    videoId?: string;
    width?: number | string;
    height?: number | string;
    playerVars?: PlayerVars;
    events?: Events;
  }

  interface PlayerVars {
    playsinline?: 0 | 1;
    controls?: 0 | 1;
    rel?: 0 | 1;
    modestbranding?: 0 | 1;
    fs?: 0 | 1;
    autoplay?: 0 | 1;
    [key: string]: any;
  }

  interface Events {
    onReady?: (event: PlayerEvent) => void;
    onStateChange?: (event: OnStateChangeEvent) => void;
    onError?: (event: OnErrorEvent) => void;
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent extends PlayerEvent {
    data: number;
  }

  interface OnErrorEvent extends PlayerEvent {
    data: number;
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }
}

interface YouTubePlayerProps {
  videoId: string;
  onReady?: (player: YT.Player) => void;
  onStateChange?: (state: number) => void;
  onError?: (error: number) => void;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
}

export function YouTubePlayer({
  videoId,
  onReady,
  onStateChange,
  onError,
  autoplay = false,
  controls = true,
  className = "",
}: YouTubePlayerProps) {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAPIReady, setIsAPIReady] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      setIsAPIReady(true);
      return;
    }

    // Load the API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set up the callback
    window.onYouTubeIframeAPIReady = () => {
      setIsAPIReady(true);
    };
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (!isAPIReady || !containerRef.current || !videoId) return;

    // Destroy existing player
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        // Player might not be fully initialized
        console.warn("Error destroying player:", e);
      }
      playerRef.current = null;
    }

    // Create a unique ID for the container
    const containerId = `youtube-player-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create a div for the player
    const playerDiv = document.createElement("div");
    playerDiv.id = containerId;
    playerDiv.style.width = "100%";
    playerDiv.style.height = "100%";
    
    // Clear and append
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(playerDiv);
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        // Create new player
        playerRef.current = new window.YT.Player(containerId, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            playsinline: 1,
            controls: controls ? 1 : 0,
            rel: 0,
            modestbranding: 1,
            fs: 1,
            autoplay: autoplay ? 1 : 0,
            origin: window.location.origin,
            enablejsapi: 1,
          },
          events: {
            onReady: (event) => {
              if (onReady) onReady(event.target);
            },
            onStateChange: (event) => {
              if (onStateChange) onStateChange(event.data);
            },
            onError: (event) => {
              console.error("YouTube player error:", event.data);
              if (onError) onError(event.data);
            },
          },
        });
      } catch (e) {
        console.error("Error creating YouTube player:", e);
      }
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying player on cleanup:", e);
        }
        playerRef.current = null;
      }
    };
  }, [isAPIReady, videoId, autoplay, controls, onReady, onStateChange, onError]);

  return <div ref={containerRef} className={className} />;
}

// Hook to control YouTube player
export function useYouTubePlayer() {
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      try {
        const time = player.getCurrentTime();
        const dur = player.getDuration();
        setCurrentTime(time);
        setDuration(dur);
      } catch (e) {
        // Player not ready yet
      }
    }, 200);

    return () => clearInterval(interval);
  }, [player]);

  const play = () => {
    if (player && typeof player.playVideo === 'function') {
      try {
        player.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.warn("Error playing video:", e);
      }
    }
  };

  const pause = () => {
    if (player && typeof player.pauseVideo === 'function') {
      try {
        player.pauseVideo();
        setIsPlaying(false);
      } catch (e) {
        console.warn("Error pausing video:", e);
      }
    }
  };

  const seekTo = (seconds: number) => {
    if (player && typeof player.seekTo === 'function') {
      try {
        player.seekTo(seconds, true);
      } catch (e) {
        console.warn("Error seeking video:", e);
      }
    }
  };

  const handleStateChange = (state: number) => {
    setIsPlaying(state === 1); // YT.PlayerState.PLAYING
  };

  return {
    player,
    setPlayer,
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    seekTo,
    handleStateChange,
  };
}

// Utility to extract video ID from YouTube URL
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}
