import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { Book, ChevronRight, GraduationCap } from "lucide-react"
import Link from "next/link"

export default async function GradePage({
  params,
}: {
  params: Promise<{ grade: string }>
}) {
  const { grade: gradeParam } = await params
  const gradeFloat = parseFloat(gradeParam)

  const grade = await prisma.grade.findUnique({
    where: { grade: gradeFloat },
    include: {
      chapters: {
        orderBy: { chapterNo: "asc" },
      },
    },
  })

  if (!grade) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold md:text-4xl">{grade.title}</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Dive into the world of {grade.title}. Master each chapter through
            interactive videos, comprehensive notes, and challenging quizzes.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-2xl font-bold">Curriculum</h2>
            <span className="font-sans text-sm text-foreground">
              {grade.chapters.length} Chapters Available
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {grade.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/grade/${grade.grade}/c/${chapter.chapterNo}`}
                className="glass-card group flex items-center justify-between p-5 transition-all hover:bg-indigo-50/50 md:p-6"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 font-bold text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                    {chapter.chapterNo}
                  </div>
                  <div className="space-y-1">
                    <h3 className="line-clamp-1 text-lg font-bold transition-colors group-hover:text-indigo-600 md:text-xl">
                      {chapter.title}
                    </h3>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-2 group-hover:text-indigo-600 md:h-6 md:w-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
