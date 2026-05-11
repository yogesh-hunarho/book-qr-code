import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Plus, FileVideo, FileText, Trash2 } from "lucide-react"
import { ChapterForm } from "../../ChapterForm"
import { DeleteChapterButton } from "../../DeleteChapterButton"
import { GenerateQRButton } from "../../GenerateQRButton"

export default async function GradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const grade = await prisma.grade.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { chapterNo: "asc" },
        include: {
          modules: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  })

  if (!grade) return notFound()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm font-bold tracking-widest text-white/40 uppercase transition-colors hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="space-y-1">
              <h1 className="gradient-text text-4xl font-bold">
                Grade {grade.grade} Content
              </h1>
              <p className="text-white/40">{grade.title}</p>
            </div>
          </div>

          <ChapterForm gradeId={grade.id} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between w-full ">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              Chapters List
              <span className="rounded-full border border-indigo-500/30 bg-indigo-600/20 px-2 py-0.5 text-xs text-indigo-400">
                {grade.chapters.length}
              </span>
            </h2>
          </div>

          <div className="grid gap-4">
            {grade.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="glass-card group flex items-center justify-between p-6"
              >
                <div className="flex items-center gap-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl font-bold transition-all group-hover:bg-indigo-600 group-hover:text-white">
                    {chapter.chapterNo}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{chapter.title}</h3>
                    <div className="mt-1 flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-400 uppercase">
                        <FileVideo className="h-3.5 w-3.5" />
                        {chapter.modules.length} Modules
                      </span>
                      {chapter.stemVideoUrl && (
                        <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-purple-400 uppercase">
                          <Plus className="h-3.5 w-3.5" />
                          STEM DIY
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ChapterForm gradeId={grade.id} chapterToEdit={chapter} />
                  <GenerateQRButton
                    path={`/grade/${grade.grade}/c/${chapter.chapterNo}`}
                    fileName={`Grade-${grade.grade}-${chapter.chapterNo}`}
                  />
                  <DeleteChapterButton
                    chapterId={chapter.id}
                    gradeId={grade.id}
                    chapterName={chapter.title}
                  />
                </div>
              </div>
            ))}

            {grade.chapters.length === 0 && (
              <div className="glass-card border-dashed border-white/10 bg-transparent py-20 text-center">
                <p className="text-white/20 italic">
                  No chapters created for this grade yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
