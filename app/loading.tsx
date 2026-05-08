"use client"

import { motion } from "framer-motion"
import { QrCode, BookOpen, Sparkles } from "lucide-react"

export default function Loading() {
  return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md overflow-hidden">
        {/* Background Gradients to match not-found.tsx */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent)]" />
          <div className="absolute bottom-0 left-0 h-full w-full bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent)]" />
        </div>

        <div className="relative flex flex-col items-center">
          {/* Ambient Glow Background */}
          <motion.div
            className="absolute -inset-24 rounded-full bg-indigo-500/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative flex items-center justify-center">
            {/* Outer Pulsing Ring */}
            <motion.div
              className="absolute h-32 w-32 rounded-full border border-indigo-200/50"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />

            {/* Main Content Container */}
            <motion.div
              className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-[0_20px_50px_rgba(79,70,229,0.15)] border border-indigo-100"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <QrCode className="h-12 w-12 text-indigo-600" />
              </motion.div>

              {/* Laser Scan Animation */}
              <motion.div
                className="absolute left-4 right-4 h-[2px] bg-indigo-500 shadow-[0_0_15px_#4f46e5]"
                animate={{
                  top: ["20%", "80%", "20%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>

            {/* Floating Book Icon */}
            <motion.div
              className="absolute -right-8 -top-8 rounded-2xl bg-white p-3 shadow-xl border border-indigo-50"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <BookOpen className="h-6 w-6 text-indigo-500" />
            </motion.div>

            {/* Floating Sparkles */}
            <motion.div
              className="absolute -left-10 -bottom-6 text-indigo-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
              }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
          </div>
        </div>
      </div>
  )
}
