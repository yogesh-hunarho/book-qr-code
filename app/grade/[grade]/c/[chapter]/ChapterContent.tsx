"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Play,
} from "lucide-react"
import { MediaViewer } from "@/components/MediaViewer"
import { QuizComponent } from "@/components/QuizComponent"
import { useProgressStore } from "@/lib/store"

interface ChapterContentProps {
  chapter: any
}

export const ChapterContent = ({ chapter }: ChapterContentProps) => {
  const hasModules = chapter.modules && chapter.modules.length > 0
  const hasStem = !!chapter.stemVideoUrl

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [activeStep, setActiveStep] = useState<
    "video" | "quiz" | "stem" | "result" | "none"
  >(hasModules ? "video" : hasStem ? "stem" : "none")
  const [videoCompleted, setVideoCompleted] = useState(false)

  const { completeChapter, isChapterCompleted, setQuizScore } =
    useProgressStore()

  const isAlreadyDone = isChapterCompleted(chapter.id)
  const currentModule = hasModules ? chapter.modules[currentModuleIndex] : null
  const isLastModule = hasModules ? currentModuleIndex === chapter.modules.length - 1 : true

  useEffect(() => {
    // Reset video completion when moving to a new module or step
    setVideoCompleted(false)

    if (isAlreadyDone) {
      setVideoCompleted(true)
    } else if (activeStep === "video" || activeStep === "stem") {
      const timer = setTimeout(() => {
        setVideoCompleted(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentModuleIndex, activeStep, isAlreadyDone])

  const handleQuizComplete = (finalScore: number) => {
    // We could store per-module scores if needed, but for now we'll just track completion
    if (isLastModule) {
      if (chapter.stemVideoUrl) {
        setActiveStep("stem")
      } else {
        setQuizScore(chapter.id, finalScore)
        completeChapter(chapter.id)
        setActiveStep("result")
      }
    } else {
      setCurrentModuleIndex((prev) => prev + 1)
      setActiveStep("video")
    }
  }

  const handleStemComplete = () => {
    completeChapter(chapter.id)
    setActiveStep("result")
  }

  return (
    <div className="container mx-auto max-w-6xl px-3 py-4 md:px-4 md:py-8">
      {/* Progress Header */}
      <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="space-y-1 text-center md:text-left">
          {/* <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
            Chapter {chapter.chapterNo}
          </h2> */}
          <h1 className="text-2xl font-black md:text-4xl">{chapter.title}</h1>
        </div>

        {(hasModules || hasStem) && (
          <div className="flex flex-wrap justify-center gap-2 rounded-3xl border border-indigo-100 bg-indigo-50/50 p-2 backdrop-blur-md">
            {chapter.modules.map((m: any, i: number) => (
              <div key={m.id} className="flex items-center gap-2">
                <button
                  disabled={i > currentModuleIndex && !isAlreadyDone}
                  onClick={() => {
                    setCurrentModuleIndex(i)
                    setActiveStep("video")
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all md:h-12 md:w-12 ${
                    i === currentModuleIndex
                      ? "bg-indigo-600 text-white shadow-lg"
                      : i < currentModuleIndex || isAlreadyDone
                        ? "bg-green-500 text-white"
                        : "bg-white text-muted-foreground opacity-50"
                  }`}
                >
                  {i < currentModuleIndex || isAlreadyDone ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{i + 1}</span>
                  )}
                </button>
              </div>
            ))}
            {chapter.stemVideoUrl && (
              <button
                disabled={
                  !isAlreadyDone &&
                  (currentModuleIndex < chapter.modules.length - 1 ||
                    activeStep !== "stem")
                }
                onClick={() => setActiveStep("stem")}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all md:h-12 md:w-12 ${
                  activeStep === "stem"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : isAlreadyDone
                      ? "bg-green-500 text-white"
                      : "bg-white text-muted-foreground opacity-50"
                }`}
              >
                <Play className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {(activeStep === "video" || activeStep === "stem") && (
            <motion.div
              key={
                activeStep === "video" ? `video-${currentModuleIndex}` : "stem"
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-xl font-bold md:text-2xl">
                  {activeStep === "video" ? (
                    <>
                      <PlayCircle className="h-6 w-6 text-indigo-600" />
                      {currentModule.title ||
                        `Module ${currentModuleIndex + 1}`}
                    </>
                  ) : (
                    <>
                      <Play className="h-6 w-6 text-red-600" />
                      STEM DIY Project
                    </>
                  )}
                </h3>
              </div>

              <MediaViewer
                videoUrl={
                  activeStep === "video"
                    ? currentModule?.videoUrl
                    : chapter.stemVideoUrl
                }
              />

              <div className="glass-card flex flex-col items-center justify-between gap-6 border-indigo-500/10 bg-indigo-600/5 p-6 md:flex-row md:p-8">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-lg font-bold md:text-xl">
                    {activeStep === "video"
                      ? "Ready for the module quiz?"
                      : "Finished the STEM project?"}
                  </h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {videoCompleted
                      ? "Great! You can now move to the next step."
                      : "Please watch the video to unlock the next step."}
                  </p>
                </div>
                <button
                  disabled={!videoCompleted}
                  onClick={() =>
                    activeStep === "video"
                      ? setActiveStep("quiz")
                      : handleStemComplete()
                  }
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-3 font-bold transition-all md:w-auto md:px-10 md:py-4 ${
                    videoCompleted
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 hover:bg-indigo-500"
                      : "cursor-not-allowed bg-secondary text-muted-foreground/30"
                  }`}
                >
                  {activeStep === "video"
                    ? "Take Module Quiz"
                    : "Finish Chapter"}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}

          {activeStep === "quiz" && (
            <motion.div
              key={`quiz-${currentModuleIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    Module {currentModuleIndex + 1} Quiz
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentModule.quiz.title}
                  </p>
                </div>
              </div>
              <QuizComponent
                quiz={currentModule.quiz}
                onComplete={handleQuizComplete}
                onCancel={() => setActiveStep("video")}
              />
            </motion.div>
          )}

          {activeStep === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card space-y-6 p-8 text-center md:space-y-10 md:p-16"
            >
              {/* <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 md:h-32 md:w-32">
                <Trophy className="h-12 w-12 text-green-400 md:h-16 md:w-16" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-1 -right-1 rounded-full bg-green-500 p-1 text-black md:-top-2 md:-right-2"
                >
                  <CheckCircle2 className="h-4 w-4 md:h-6 md:w-6" />
                </motion.div>
              </div> */}

              <div className="space-y-2 md:space-y-3">
                <h2 className="text-3xl font-bold md:text-5xl">
                  Chapter Mastered!
                </h2>
                <p className="text-lg text-muted-foreground md:text-xl">
                  You&apos;ve successfully completed Chapter {chapter.chapterNo}
                  : {chapter.title}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 pt-4 md:flex-row md:gap-6 md:pt-6">
                <button
                  onClick={() => {
                    setCurrentModuleIndex(0)
                    setActiveStep("video")
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-8 py-4 font-bold transition-all hover:bg-indigo-100"
                >
                  <RotateCcw className="h-5 w-5" />
                  Review Chapter
                </button>
                {/* <div className="rounded-2xl bg-green-500 px-8 py-4 font-bold text-white shadow-lg shadow-green-500/20">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Certified
                  </div>
                </div> */}
              </div>
            </motion.div>
          )}
          {activeStep === "none" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-64 flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-indigo-100 bg-indigo-50/20 text-indigo-400"
            >
              <FileText className="h-12 w-12 opacity-20" />
              <p className="font-medium">No content available for this chapter yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
