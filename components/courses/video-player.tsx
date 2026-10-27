"use client"

import * as React from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Film,
  RotateCw,
  Gauge,
  Sliders,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import confetti from "canvas-confetti"

interface VideoPlayerProps {
  videoUrl?: string | null
  title: string
  duration?: string
  courseCategory?: string
  onComplete?: () => void
  onNextLesson?: () => void
  hasNextLesson?: boolean
  nextLessonTitle?: string
}

function getYouTubeId(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

const CATEGORY_FALLBACK_VIDEOS: Record<string, string> = {
  Programming: "https://www.youtube.com/embed/8hly31xKli0",
  "Web Development": "https://www.youtube.com/embed/bMknfKXIFA8",
  "Artificial Intelligence": "https://www.youtube.com/embed/i_LwzRVP7bg",
  "Data Science": "https://www.youtube.com/embed/HXV3zeQKqGY",
  Cybersecurity: "https://www.youtube.com/embed/inWWhr5tnEA",
  "Cloud Computing": "https://www.youtube.com/embed/k1RI5locZE4",
}

const HTML5_SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
]

function formatSeconds(secs: number): string {
  if (isNaN(secs) || secs < 0) return "00:00"
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`
}

export function VideoPlayer({
  videoUrl,
  title,
  duration,
  courseCategory = "Programming",
  onComplete,
  onNextLesson,
  hasNextLesson = false,
  nextLessonTitle,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1.0)
  const [isTheater, setIsTheater] = React.useState(false)
  const [useHtml5Direct, setUseHtml5Direct] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [volume, setVolume] = React.useState(1)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [videoDuration, setVideoDuration] = React.useState(360) // default 6 min in seconds
  const [watchedPercent, setWatchedPercent] = React.useState(0)
  const [isVideoFinished, setIsVideoFinished] = React.useState(false)

  const videoRef = React.useRef<HTMLVideoElement>(null)
  const playerContainerRef = React.useRef<HTMLDivElement>(null)

  // Parse duration if given in string format like "25 min"
  React.useEffect(() => {
    if (duration) {
      const match = duration.match(/(\d+)\s*min/)
      if (match && match[1]) {
        const parsed = parseInt(match[1], 10) * 60
        setVideoDuration(parsed)
      }
    }
  }, [duration])

  // Resolve video URL
  const resolvedUrl = React.useMemo(() => {
    if (useHtml5Direct) {
      return HTML5_SAMPLE_VIDEOS[0]
    }
    if (videoUrl && videoUrl.trim().length > 0) {
      return videoUrl.trim()
    }
    return CATEGORY_FALLBACK_VIDEOS[courseCategory] || "https://www.youtube.com/embed/8hly31xKli0"
  }, [videoUrl, courseCategory, useHtml5Direct])

  const youtubeId = React.useMemo(() => {
    if (useHtml5Direct) return null
    return getYouTubeId(resolvedUrl)
  }, [resolvedUrl, useHtml5Direct])

  const isDirectVideo = React.useMemo(() => {
    if (useHtml5Direct) return true
    return (
      resolvedUrl.endsWith(".mp4") ||
      resolvedUrl.endsWith(".webm") ||
      resolvedUrl.endsWith(".ogg") ||
      resolvedUrl.includes("commondatastorage.googleapis.com")
    )
  }, [resolvedUrl, useHtml5Direct])

  const handleComplete = React.useCallback(() => {
    setIsPlaying(false)
    setIsVideoFinished(true)
    setWatchedPercent(100)
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })
    if (onComplete) onComplete()
  }, [onComplete])

  // Simulated progress timer for YouTube embed / non-native players
  React.useEffect(() => {
    let timer: any = null
    if (!isDirectVideo && isPlaying && !isVideoFinished) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackSpeed
          const pct = Math.min(100, Math.round((next / videoDuration) * 100))
          setWatchedPercent(pct)
          if (next >= videoDuration) {
            handleComplete()
            return videoDuration
          }
          return next
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying, isDirectVideo, playbackSpeed, videoDuration, isVideoFinished, handleComplete])

  // Listen for Escape key to exit theater mode
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTheater) {
        setIsTheater(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isTheater])

  const handleTogglePlay = () => {
    if (isDirectVideo && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    } else {
      setIsPlaying((prev) => !prev)
    }
  }

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(newTime, videoDuration))
    setCurrentTime(clamped)
    const pct = Math.min(100, Math.round((clamped / videoDuration) * 100))
    setWatchedPercent(pct)
    if (isDirectVideo && videoRef.current) {
      videoRef.current.currentTime = clamped
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime
      const dur = videoRef.current.duration || videoDuration
      setCurrentTime(cur)
      if (dur > 0) {
        setVideoDuration(dur)
        const pct = Math.min(100, Math.round((cur / dur) * 100))
        setWatchedPercent(pct)
      }
    }
  }

  const handleChangeSpeed = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    } else {
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol)
    setIsMuted(newVol === 0)
    if (videoRef.current) {
      videoRef.current.volume = newVol
      videoRef.current.muted = newVol === 0
    }
  }

  const handleSkip = (seconds: number) => {
    handleSeek(currentTime + seconds)
  }

  return (
    <div
      ref={playerContainerRef}
      className={`space-y-3 transition-all duration-300 ${
        isTheater
          ? "fixed inset-x-2 md:inset-x-8 top-16 z-50 bg-background/98 p-4 md:p-6 rounded-3xl shadow-2xl border border-primary/20 backdrop-blur-xl"
          : ""
      }`}
    >
      {/* Video Viewport Container */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-black aspect-video w-full shadow-2xl flex items-center justify-center group">
        {youtubeId ? (
          <iframe
            key={youtubeId}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setIsPlaying(true)}
          />
        ) : isDirectVideo ? (
          <video
            ref={videoRef}
            src={resolvedUrl}
            className="w-full h-full object-contain"
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleComplete}
          />
        ) : (
          <iframe
            src={resolvedUrl}
            title={title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Video Completion Overlay */}
        {isVideoFinished && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-6 text-center text-white animate-in fade-in duration-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold font-display">Lesson Video Completed! 🎓</h3>
            <p className="text-xs text-white/80 max-w-sm mt-1">
              You&apos;ve completed the video portion. Review the study notes, solve practice problems, or continue to the next lesson.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsVideoFinished(false)
                  handleSeek(0)
                  handleTogglePlay()
                }}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Replay Video
              </Button>

              {hasNextLesson && onNextLesson ? (
                <Button
                  size="sm"
                  onClick={() => {
                    setIsVideoFinished(false)
                    onNextLesson()
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-1.5 shadow-lg"
                >
                  Next: {nextLessonTitle ? nextLessonTitle.slice(0, 24) + "..." : "Next Lesson"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Badge className="bg-emerald-500 text-white py-1 px-3 text-xs font-semibold">
                  Course Complete 🏆
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Theater mode close button */}
        {isTheater && (
          <button
            onClick={() => setIsTheater(false)}
            className="absolute top-4 right-4 z-40 rounded-full bg-black/70 p-2 text-white hover:bg-black transition-all"
            title="Exit Theater Mode (Esc)"
          >
            <Minimize2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Interactive Video Scrubber & Playback Controls Bar */}
      <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs space-y-3">
        {/* Scrubber / Progress Bar with interactive seek */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
            <span className="text-foreground">{formatSeconds(currentTime)}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-primary font-bold">{watchedPercent}% Watched</span>
              <span>•</span>
              <span>{formatSeconds(videoDuration)}</span>
            </div>
          </div>

          <div
            className="relative h-2 w-full bg-muted rounded-full cursor-pointer overflow-hidden group/scrubber"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const clickX = e.clientX - rect.left
              const fraction = Math.max(0, Math.min(1, clickX / rect.width))
              handleSeek(fraction * videoDuration)
            }}
          >
            <div
              className="absolute top-0 bottom-0 left-0 bg-primary transition-all duration-150 rounded-full"
              style={{ width: `${watchedPercent}%` }}
            />
          </div>
        </div>

        {/* Primary Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Play/Pause, Skip, Volume */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleTogglePlay}
              className="h-8 px-3 gap-1.5 text-xs font-bold shadow-xs"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Play
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSkip(-10)}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="text-[10px] ml-0.5">10s</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSkip(10)}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              title="Forward 10 seconds"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span className="text-[10px] ml-0.5">10s</span>
            </Button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 pl-1">
              <button
                type="button"
                onClick={handleToggleMute}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-3.5 w-3.5 text-destructive" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-14 h-1.5 accent-primary cursor-pointer hidden sm:block"
                title="Volume"
              />
            </div>
          </div>

          {/* Right: Speed, Mode Switcher, Mark Done, Theater, Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Speed Selector */}
            <div className="flex items-center gap-0.5 bg-muted/60 p-0.5 rounded-lg border border-border">
              {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => handleChangeSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                    playbackSpeed === spd
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Fast Mark Watched Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleComplete}
              className="h-8 text-xs gap-1 font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20"
              title="Mark video as watched & update progress"
            >
              <Check className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Watched</span>
            </Button>

            {/* HTML5 Native vs YouTube switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUseHtml5Direct(!useHtml5Direct)}
              className="h-8 text-[11px] gap-1 px-2 text-muted-foreground hover:text-foreground"
              title="Toggle between Stream and HTML5 Native Video"
            >
              <Film className="h-3 w-3" />
              <span className="hidden md:inline">{useHtml5Direct ? "Stream" : "HTML5"}</span>
            </Button>

            {/* Theater Mode */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTheater(!isTheater)}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              title="Toggle Theater Mode"
            >
              {isTheater ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>

            {/* External YouTube Link if applicable */}
            {youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 h-8 px-2 text-[11px] text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                title="Watch on YouTube"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
