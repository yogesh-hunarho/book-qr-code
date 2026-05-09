import prisma from "@/lib/prisma"
import Link from "next/link"
import { Plus, Book, ChevronRight } from "lucide-react"
import { GradeForm } from "./GradeForm"
import { GenerateQRButton } from "./GenerateQRButton"
import { EditGradeTitleButton } from "./EditGradeTitleButton"
import { Navbar } from "@/components/Navbar"
// import { DeleteGradeButton } from "./DeleteGradeButton"

export default async function AdminPage() {
  const grades = await prisma.grade.findMany({
    include: {
      _count: {
        select: { chapters: true },
      },
    },
    orderBy: { grade: "asc" },
  })

  return (
    <div className="container mx-auto">
      <Navbar />
      <div className="mx-auto max-w-6xl space-y-8 md:space-y-12 px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="gradient-text text-3xl md:text-4xl font-bold text-center md:text-left">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm md:text-base text-center md:text-left">
              Manage your grades, chapters, and quizzes.
            </p>
          </div>
          <div className="flex justify-center md:block">
            <GradeForm />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {grades.map((grade) => (
            <div key={grade.id} className="glass-card group flex flex-col">
              <div className="flex-1 space-y-4 p-6 md:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-600">
                    <Book className="h-8 w-8" />
                  </div>
                  <div className="rounded-lg border border-border bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
                    {grade._count.chapters} CHAPTERS
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold transition-colors group-hover:text-indigo-600">
                    Grade {grade.grade}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{grade.title}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-border bg-secondary/30 p-4">
                <Link
                  href={`/admin/grade/${grade.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/10 transition-all hover:bg-indigo-500"
                >
                  Manage Chapters
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <div className="flex gap-2">
                  <EditGradeTitleButton
                    gradeId={grade.id}
                    currentTitle={grade.title}
                    gradeValue={grade.grade}
                  />
                  <GenerateQRButton
                    path={`/grade/${grade.grade}`}
                    fileName={`Grade-${grade.grade}-Full-Book`}
                  />
                 </div>
              </div>
            </div>
          ))}

          {grades.length === 0 && (
            <div className="glass-card col-span-full space-y-4 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary">
                <Plus className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground">
                No grades found. Create your first grade to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
