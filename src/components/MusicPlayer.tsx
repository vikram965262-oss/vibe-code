import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

type ColorTheme = 'cyan' | 'fuchsia' | 'purple';

interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
  color: ColorTheme;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Cybernetic Pulse",
    artist: "AI Gen - Synthwave",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "cyan"
  },
  {
    id: 2,
    title: "Neon Overdrive",
    artist: "AI Gen - Darksynth",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "fuchsia"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "AI Gen - Retrowave",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "purple"
  }
];

const colorMap = {
  cyan: {
    bg: 'bg-cyan-500',
    bgLight: 'bg-cyan-500/10',
    bgHover: 'hover:bg-cyan-500/20',
    text: 'text-cyan-400',
    border: 'border-cyan-500',
    borderLight: 'border-cyan-500/50',
    shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    shadowHover: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    shadowProgress: 'shadow-[0_0_10px_rgba(6,182,212,0.8)]',
    glow: 'bg-cyan-500/20'
  },
  fuchsia: {
    bg: 'bg-fuchsia-500',
    bgLight: 'bg-fuchsia-500/10',
    bgHover: 'hover:bg-fuchsia-500/20',
    text: 'text-fuchsia-400',
    border: 'border-fuchsia-500',
    borderLight: 'border-fuchsia-500/50',
    shadow: 'shadow-[0_0_15px_rgba(217,70,239,0.3)]',
    shadowHover: 'hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]',
    shadowProgress: 'shadow-[0_0_10px_rgba(217,70,239,0.8)]',
    glow: 'bg-fuchsia-500/20'
  },
  purple: {
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-500/10',
    bgHover: 'hover:bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500',
    borderLight: 'border-purple-500/50',
    shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    shadowHover: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    shadowProgress: 'shadow-[0_0_10px_rgba(168,85,247,0.8)]',
    glow: 'bg-purple-500/20'
  }
};

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];
  const theme = colorMap[currentTrack.color];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 ${theme.glow} rounded-full blur-3xl transition-colors duration-1000`} />
      <div className={`absolute -bottom-20 -left-20 w-40 h-40 ${theme.glow} rounded-full blur-3xl transition-colors duration-1000`} />

      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-xl bg-gray-950 border ${theme.borderLight} flex items-center justify-center ${theme.shadow} transition-all duration-500`}>
            <Music className={`${theme.text} ${isPlaying ? 'animate-pulse' : ''} transition-colors duration-500`} size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-100 truncate drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
              {currentTrack.title}
            </h3>
            <p className={`text-sm ${theme.text} opacity-80 truncate font-mono transition-colors duration-500`}>
              {currentTrack.artist}
            </p>
          </div>
          <button 
            onClick={toggleMute}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div 
            className="h-1.5 w-full bg-gray-800 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <div 
              className={`h-full ${theme.bg} ${theme.shadowProgress} transition-all duration-100 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={playPrev}
            className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`p-4 rounded-full ${theme.bgLight} border ${theme.border} ${theme.text} ${theme.bgHover} ${theme.shadowHover} transition-all duration-300`}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={playNext}
            className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
