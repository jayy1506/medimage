"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  FastForward,
  Rewind,
  Sparkles,
  Film,
  Tv,
  Radio,
  CheckCircle2,
  Share2
} from "lucide-react";

interface Chapter {
  time: number;
  label: string;
  tag: string;
  description: string;
}

const VIDEO_CHAPTERS: Chapter[] = [
  { time: 0, label: "Introduction to Medical Imaging", tag: "Overview", description: "The dawn of non-invasive diagnostics." },
  { time: 25, label: "Projection Radiography & X-Ray", tag: "X-Ray", description: "Differential photon attenuation through anatomical tissue." },
  { time: 65, label: "Computed Tomography (CT)", tag: "CT", description: "Rotating fan-beams, sinograms, and 3D Hounsfield units." },
  { time: 110, label: "Magnetic Resonance Imaging (MRI)", tag: "MRI", description: "Proton precession, radiofrequency excitation, and soft-tissue contrast." },
  { time: 160, label: "Diagnostic Ultrasound (US)", tag: "US", description: "High-frequency piezoelectric sound waves and acoustic impedance." }
];

interface ClinicalVideoPlayerProps {
  src: string;
  title: string;
  description?: string;
  className?: string;
  autoPlay?: boolean;
}

export default function ClinicalVideoPlayer({
  src,
  title,
  description,
  className = "",
  autoPlay = false
}: ClinicalVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Determine active chapter
      for (let i = VIDEO_CHAPTERS.length - 1; i >= 0; i--) {
        if (video.currentTime >= VIDEO_CHAPTERS[i].time) {
          setActiveChapter(i);
          break;
        }
      }
    };

    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const onEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const jumpToTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const skipSeconds = (delta: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Cinematic Main Video Workstation Frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative group bg-[#090d16] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl shadow-cyan-950/20 select-none transition-all"
      >
        {/* Top Clinical Stream Header Badge */}
        <div
          className={`absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-adani-pink/20 border border-adani-pink/40 text-adani-pink text-[11px] font-mono font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-adani-pink animate-ping" />
                Clinical Media
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold">
                1080p Full HD
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded bg-adani-cyan/20 border border-adani-cyan/40 text-adani-cyan text-[10px] font-mono font-bold">
                AIDS 12605.1
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-white tracking-wide block truncate max-w-xs">
                {title}
              </span>
            </div>
          </div>
        </div>

        {/* Video Screen Area */}
        <div
          onClick={togglePlay}
          className="relative w-full aspect-video cursor-pointer flex items-center justify-center bg-black"
        >
          <video
            ref={videoRef}
            src={src}
            autoPlay={autoPlay}
            playsInline
            className="w-full h-full object-contain"
          />

          {/* Center Play Overlay Icon when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
              <div className="relative group/btn flex items-center justify-center">
                <div className="absolute -inset-4 bg-adani-cyan/30 rounded-full blur-xl animate-pulse" />
                <button
                  type="button"
                  aria-label="Play video"
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-adani-navy via-slate-900 to-adani-pink border-2 border-adani-cyan/80 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95"
                >
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white translate-x-0.5 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Floating Control Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress Slider */}
          <div className="relative group/scrub mb-2 sm:mb-3">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Video scrubber"
              className="w-full h-1.5 sm:h-2 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-adani-cyan focus:outline-none transition-all hover:h-2.5"
            />
            {/* Timeline progress indicator */}
            <div
              className="absolute top-0 left-0 h-1.5 sm:h-2 bg-gradient-to-r from-adani-cyan via-sky-400 to-adani-pink rounded-lg pointer-events-none transition-all group-hover/scrub:h-2.5"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Lower Action Row */}
          <div className="flex items-center justify-between text-white text-xs">
            {/* Left Controls: Play, Skip, Volume, Time */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => skipSeconds(-10)}
                title="Rewind 10 seconds"
                aria-label="Rewind 10 seconds"
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => skipSeconds(10)}
                title="Forward 10 seconds"
                aria-label="Forward 10 seconds"
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <FastForward className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="p-1.5 text-slate-300 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-adani-pink" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume level"
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-adani-cyan"
                />
              </div>

              {/* Time display */}
              <div className="font-mono text-[11px] text-slate-300 ml-1">
                <span className="text-white font-bold">{formatTime(currentTime)}</span>
                <span className="text-slate-500 mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Speed, Chapter Indicator, Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={changeSpeed}
                title="Playback Speed"
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[11px] font-mono font-bold border border-slate-700 transition-colors"
              >
                {playbackSpeed}x
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Clinical Chapters & Timeline Jump Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-adani-cyan" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Interactive Clinical Chapters
            </h4>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            Click any section to jump in video
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {VIDEO_CHAPTERS.map((ch, idx) => {
            const isCurrent = activeChapter === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => jumpToTime(ch.time)}
                className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isCurrent
                    ? "bg-sky-50/80 border-adani-cyan text-adani-navy shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isCurrent ? "bg-adani-cyan text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {ch.tag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    {formatTime(ch.time)}
                  </span>
                </div>
                <span className="font-bold text-[11px] truncate block text-slate-900">
                  {ch.label}
                </span>
                <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                  {ch.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
