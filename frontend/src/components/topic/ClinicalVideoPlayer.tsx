"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  AlertCircle
} from "lucide-react";

interface Chapter {
  time: number;
  label: string;
}

const VIDEO_CHAPTERS: Chapter[] = [
  { time: 0, label: "Overview" },
  { time: 25, label: "X-Ray" },
  { time: 65, label: "CT Scan" },
  { time: 110, label: "MRI" },
  { time: 160, label: "Ultrasound" }
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
  const [hasError, setHasError] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    for (let i = VIDEO_CHAPTERS.length - 1; i >= 0; i--) {
      if (video.currentTime >= VIDEO_CHAPTERS[i].time) {
        setActiveChapter(i);
        break;
      }
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setHasError(false);
    }
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasError(false);
          })
          .catch((err) => {
            console.warn("Direct unmuted play blocked by browser policy, trying muted:", err);
            video.muted = true;
            setIsMuted(true);
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch((finalErr) => {
                console.error("Playback failed completely:", finalErr);
                setHasError(true);
              });
          });
      }
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
      const newTime = Math.max(0, Math.min(duration || 1000, videoRef.current.currentTime + delta));
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
    const speeds = [1, 1.25, 1.5, 2];
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
    }, 2500);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 ${className}`}>
      {/* Video Workstation Frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative group bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-sm select-none"
      >
        {/* Subtle Top Header Overlay on Hover */}
        <div
          className={`absolute top-0 left-0 right-0 z-20 px-4 py-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-200 pointer-events-none ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-white">
            <span className="font-medium text-slate-200 truncate">{title}</span>
            {description && (
              <span className="text-slate-400 text-[11px] hidden sm:inline ml-2 truncate max-w-xs">
                {description}
              </span>
            )}
          </div>
        </div>

        {/* Video Area */}
        <div
          onClick={togglePlay}
          className="relative w-full aspect-video cursor-pointer flex items-center justify-center bg-black"
        >
          <video
            ref={videoRef}
            src={src}
            autoPlay={autoPlay}
            playsInline
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain"
          />

          {/* Minimal Play Overlay Button */}
          {!isPlaying && !hasError && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-all cursor-pointer z-10"
            >
              <button
                type="button"
                onClick={togglePlay}
                aria-label="Play video"
                className="w-16 h-16 rounded-full bg-white/95 hover:bg-white text-slate-900 flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 pointer-events-auto"
              >
                <Play className="w-7 h-7 fill-slate-900 text-slate-900 translate-x-0.5" />
              </button>
            </div>
          )}

          {/* Error Notice */}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-white p-4 text-center z-10">
              <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
              <p className="text-xs font-semibold text-slate-200">Video source currently unavailable locally or on cloud.</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                Target: {src}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setHasError(false);
                  if (videoRef.current) {
                    videoRef.current.load();
                    togglePlay();
                  }
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-all"
              >
                Retry Playback
              </button>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 px-3.5 py-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-200 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Scrubber */}
          <div className="relative group/scrub mb-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Video scrubber"
              className="w-full h-1 bg-slate-700/80 rounded appearance-none cursor-pointer accent-white hover:h-1.5 transition-all"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between text-white text-xs">
            {/* Left Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="p-1 text-slate-200 hover:text-white transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => skipSeconds(-10)}
                title="Rewind 10s"
                aria-label="Rewind 10 seconds"
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Volume Slider */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="p-1 text-slate-300 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume level"
                  className="w-14 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-white"
                />
              </div>

              {/* Time display */}
              <div className="font-mono text-[11px] text-slate-400 ml-1">
                <span className="text-slate-200 font-semibold">{formatTime(currentTime)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={changeSpeed}
                title="Playback Speed"
                className="px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 transition-colors"
              >
                {playbackSpeed}x
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                className="p-1 text-slate-300 hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Chapter Quick-Jump Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1 flex-shrink-0">
          Chapters:
        </span>
        {VIDEO_CHAPTERS.map((ch, idx) => {
          const isCurrent = activeChapter === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => jumpToTime(ch.time)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex-shrink-0 flex items-center gap-1.5 ${
                isCurrent
                  ? "bg-slate-900 text-white border border-slate-900 shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              <span className="font-mono text-[10px] text-slate-400">{formatTime(ch.time)}</span>
              <span>{ch.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
