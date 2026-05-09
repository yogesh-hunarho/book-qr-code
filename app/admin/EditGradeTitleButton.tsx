"use client"

import { useState } from "react"
import { Edit2, X, Check, Loader2 } from "lucide-react"
import { updateGradeTitle } from "./actions"

interface EditGradeTitleButtonProps {
  gradeId: string
  currentTitle: string
  gradeValue: number
}

export function EditGradeTitleButton({
  gradeId,
  currentTitle,
  gradeValue,
}: EditGradeTitleButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState(currentTitle)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await updateGradeTitle(gradeId, title.trim())
      setIsOpen(false)
    } catch {
      alert("Failed to update title. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs font-bold text-amber-500 transition-all hover:bg-amber-500 hover:text-white"
        title="Edit Grade Title"
      >
        <Edit2 className="h-3.5 w-3.5" />
        Edit Title
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="glass-card relative w-full max-w-md animate-in p-8 duration-200 fade-in zoom-in-95">
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6 space-y-1">
              <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
                Grade {gradeValue}
              </p>
              <h2 className="text-2xl font-bold">Edit Title</h2>
              <p className="text-sm text-muted-foreground">
                Update the display title for this grade.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  autoFocus
                  placeholder="e.g. Unit 2: Our Biosphere"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-black shadow-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-xl border border-border py-3 text-sm font-bold text-muted-foreground transition-all hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {loading ? "Saving..." : "Save Title"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
