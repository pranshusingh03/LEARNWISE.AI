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
  Settings,
  Film,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface VideoPlayerProps {
  videoUrl?: string | null
  title: string
  duration?: string
  courseCategory?: string
  onComplete?: () => void
  onNextLesson?: () => void
  hasNextLesson?: boolean
}

// Extract YouTube ID from various YouTube URL formats
function getYouTubeId(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

// Fallback topic videos
const CATEGORY_FALLBACK_VIDEOS: Record<string, string> = {
  Programming: "https://www.youtube.com/embed/8hly31xKli0", // CS50 / DSA
  "Web Development": "https://www.youtube.com/embed/bMknfKXIFA8", // React Full Course
  "Artificial Intelligence": "https://www.youtube.com/embed/i_LwzRVP7bg", // ML Course
  "Data Science": "https://www.youtube.com/embed/HXV3zeQKqGY", // SQL / Data
  Cybersecurity: "https://www.youtube.com/embed/inWWhr5tnEA", // Cyber Security
  "Cloud Computing": "https://www.youtube.com/embed/k1RI5locZE4", // AWS Cloud
}

export function VideoPlayer({
  videoUrl,
  title,
  duration,
  courseCategory = "Programming",
  onComplete,
  onNextLesson,
  hasNextLesson,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1.0)
  const [isTheater, setIsTheater] = React.useState(false)
  const [useHtml5Direct, setUseHtml5Direct] = React.useState(false)
  const [playerLoaded, setPlayerLoaded] = React.useState(false)

  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Resolve actual effective URL
  const resolvedUrl = React.useMemo(() => {
    if (useHtml5Direct) {
      return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
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

  // Handle HTML5 playback controls
  const handleTogglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleChangeSpeed = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
    if (onComplete) onComplete()
  }

  return (
    <div
      className={`space-y-3 transition-all duration-300 ${
        isTheater ? "fixed inset-x-4 top-20 z-50 bg-background/95 p-4 rounded-3xl shadow-2xl border border-border" : ""
      }`}
    >
      {/* Video Viewport Container */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-black aspect-video w-full shadow-2xl flex items-center justify-center">
        {youtubeId ? (
          <iframe
            key={youtubeId}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setPlayerLoaded(true)}
          />
        ) : isDirectVideo ? (
          <div className="relative w-full h-full group">
            <video
              ref={videoRef}
              src={resolvedUrl}
              className="w-full h-full object-contain"
              controls
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnded}
            />
          </div>
        ) : (
          <iframe
            src={resolvedUrl}
            title={title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Theater mode close button */}
        {isTheater && (
          <button
            onClick={() => setIsTheater(false)}
            className="absolute top-4 right-4 z-50 rounded-full bg-black/70 p-2 text-white hover:bg-black transition-all"
            title="Exit Theater Mode"
          >
            <Minimize2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Video Control & Meta Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-card shadow-xs text-xs">
        {/* Left: Video details & badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="gap-1 bg-muted/50 border-border text-[11px] font-semibold">
            <Film className="h-3 w-3 text-primary" />
            {youtubeId ? "YouTube HD" : isDirectVideo ? "HTML5 Native Player" : "Video Stream"}
          </Badge>

          <Badge variant="outline" className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
            1080p High Definition
          </Badge>

          {duration && (
            <span className="text-muted-foreground font-medium hidden sm:inline-block">
              Duration: {duration}
            </span>
          )}
        </div>

        {/* Right: Interactive controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
            <span className="text-[10px] font-bold text-muted-foreground px-1">Speed:</span>
            {[1, 1.25, 1.5, 2].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => handleChangeSpeed(speed)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  playbackSpeed === speed
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Direct MP4 / YouTube Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUseHtml5Direct(!useHtml5Direct)}
            className="h-7 text-[11px] gap-1 px-2 text-muted-foreground hover:text-foreground"
            title="Toggle between YouTube stream and Native HTML5 Direct video"
          >
            <RotateCcw className="h-3 w-3" />
            {useHtml5Direct ? "Switch to YouTube" : "Try HTML5 MP4"}
          </Button>

          {/* External Link */}
          {youtubeId && (
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
              title="Open video on YouTube in a new tab"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">Open YouTube</span>
            </a>
          )}

          {/* Theater Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTheater(!isTheater)}
            className="h-7 text-[11px] gap-1 px-2 text-muted-foreground hover:text-foreground"
            title="Toggle Theater Mode"
          >
            {isTheater ? (
              <>
                <Minimize2 className="h-3 w-3" />
                Exit Theater
              </>
            ) : (
              <>
                <Maximize2 className="h-3 w-3" />
                Theater
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
