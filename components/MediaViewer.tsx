"use client"

import { PlayCircle, FileText, ExternalLink, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"

interface MediaViewerProps {
  videoUrl?: string | null
  title?: string | null
  description?: string | null
}

export const MediaViewer = ({ videoUrl, title, description }: MediaViewerProps) => {
  if (!videoUrl) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-[3rem] border border-white/10 bg-secondary/30 text-muted-foreground backdrop-blur-xl">
        <div className="rounded-full bg-secondary p-6 shadow-inner">
          <PlayCircle className="h-12 w-12 opacity-20" />
        </div>
        <p className="font-medium tracking-wide">No resource available yet.</p>
      </div>
    )
  }

  const isDrive = videoUrl.includes("drive.google.com")
  const isYoutube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
  const isCanva = videoUrl.includes("canva.com")

  return (
    <div className="group relative overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#0a0a0c] p-1 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/10">      
      <div className="relative flex min-h-[350px] flex-col items-center justify-center px-6 py-10 text-center md:px-10">
        <div className="mb-10 relative group-hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/30 blur-2xl" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/20 bg-white/5 shadow-2xl backdrop-blur-2xl">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent" />
            {isYoutube ? (
              <PlayCircle className="relative h-12 w-12 text-red-500 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            ) : isCanva ? (
              <FileText className="relative h-12 w-12 text-cyan-400 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
            ) : isDrive ? (
              <div className="relative h-12 w-12 flex items-center justify-center">
                <div className="h-10 w-10 border-4 border-yellow-400 rounded-lg border-t-green-500 border-r-blue-500 shadow-lg" />
              </div>
            ) : (
              <ExternalLink className="relative h-12 w-12 text-indigo-400" />
            )}
          </div>
        </div>

        <div className="max-w-3xl space-y-6">
          <h3 className="text-3xl font-bold tracking-tight capitalize text-white md:text-4xl lg:text-5xl leading-[1.1]">
            {title || "Watch Lesson Video"}
          </h3>
          
          {description && (
            <p className="mx-auto max-w-xl text-sm text-white/50 leading-relaxed md:text-lg font-medium">
              {description}
            </p>
          )}
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative flex items-center gap-4 overflow-hidden rounded-4xl bg-indigo-600 px-12 py-6 text-xl font-bold text-white transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(79,70,229,0.3)]"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
            <span>Open in New Tab</span>
            <ExternalLink className="h-6 w-6 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          </a>
        </div>
      </div>
    </div>
  )
}

