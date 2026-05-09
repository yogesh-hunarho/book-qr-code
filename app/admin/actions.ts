"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGrade(formData: FormData) {
  const grade = parseInt(formData.get("grade") as string);
  const title = formData.get("title") as string;

  await prisma.grade.create({
    data: { grade, title },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateGradeTitle(gradeId: string, title: string) {
  await prisma.grade.update({
    where: { id: gradeId },
    data: { title },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createChapter(
  gradeId: string,
  formData: FormData,
  modules: any[]
) {
  const chapterNo = parseInt(formData.get("chapterNo") as string)
  const title = formData.get("title") as string
  const stemVideoUrl = (formData.get("stemVideoUrl") as string) || null

  await prisma.chapter.create({
    data: {
      gradeId,
      chapterNo,
      title,
      stemVideoUrl,
      modules: {
        create: modules.map((m, index) => ({
          title: m.title || `Module ${index + 1}`,
          videoUrl: m.videoUrl,
          order: index + 1,
          quiz: m.quizData
            ? {
                create: {
                  title: m.quizData.title,
                  totalQuestions: m.quizData.totalQuestions,
                  questions: {
                    create: m.quizData.questions.map((q: any) => ({
                      question: q.question,
                      options: q.options,
                      correctAnswer: q.correctAnswer,
                      hint: q.hint || null,
                    })),
                  },
                },
              }
            : undefined,
        })),
      },
    },
  })

  revalidatePath(`/admin/grade/${gradeId}`)
  revalidatePath(`/grade`)
}

export async function updateChapter(
  chapterId: string,
  gradeId: string,
  formData: FormData,
  modules: any[]
) {
  const chapterNo = parseInt(formData.get("chapterNo") as string)
  const title = formData.get("title") as string
  const stemVideoUrl = (formData.get("stemVideoUrl") as string) || null

  // 1. Delete existing modules and quizzes
  const oldModules = await prisma.chapterModule.findMany({
    where: { chapterId },
  })
  for (const m of oldModules) {
    const quiz = await prisma.quiz.findUnique({ where: { moduleId: m.id } })
    if (quiz) {
      await prisma.question.deleteMany({ where: { quizId: quiz.id } })
      await prisma.quiz.delete({ where: { id: quiz.id } })
    }
  }
  await prisma.chapterModule.deleteMany({ where: { chapterId } })

  // 2. Update chapter details and recreate modules
  await prisma.chapter.update({
    where: { id: chapterId },
    data: {
      chapterNo,
      title,
      stemVideoUrl,
      modules: {
        create: modules.map((m, index) => ({
          title: m.title || `Module ${index + 1}`,
          videoUrl: m.videoUrl,
          order: index + 1,
          quiz: m.quizData
            ? {
                create: {
                  title: m.quizData.title,
                  totalQuestions: m.quizData.totalQuestions,
                  questions: {
                    create: m.quizData.questions.map((q: any) => ({
                      question: q.question,
                      options: q.options,
                      correctAnswer: q.correctAnswer,
                      hint: q.hint || null,
                    })),
                  },
                },
              }
            : undefined,
        })),
      },
    },
  })

  revalidatePath(`/admin/grade/${gradeId}`)
  revalidatePath(`/grade`)
}

export async function deleteChapter(chapterId: string, gradeId: string) {
  // First delete modules, quizzes, and questions
  const modules = await prisma.chapterModule.findMany({ where: { chapterId } })

  for (const m of modules) {
    const quiz = await prisma.quiz.findUnique({ where: { moduleId: m.id } })
    if (quiz) {
      await prisma.question.deleteMany({ where: { quizId: quiz.id } })
      await prisma.quiz.delete({ where: { id: quiz.id } })
    }
  }

  await prisma.chapterModule.deleteMany({ where: { chapterId } })
  await prisma.chapter.delete({ where: { id: chapterId } })

  revalidatePath(`/admin/grade/${gradeId}`)
}

export async function deleteGrade(gradeId: string) {
  // Delete all associated chapters, modules, quizzes, and questions
  const chapters = await prisma.chapter.findMany({ where: { gradeId } })

  for (const chapter of chapters) {
    const modules = await prisma.chapterModule.findMany({
      where: { chapterId: chapter.id },
    })
    for (const m of modules) {
      const quiz = await prisma.quiz.findUnique({ where: { moduleId: m.id } })
      if (quiz) {
        await prisma.question.deleteMany({ where: { quizId: quiz.id } })
        await prisma.quiz.delete({ where: { id: quiz.id } })
      }
    }
    await prisma.chapterModule.deleteMany({ where: { chapterId: chapter.id } })
  }

  await prisma.chapter.deleteMany({ where: { gradeId } })
  await prisma.grade.delete({ where: { id: gradeId } })

  revalidatePath("/admin")
  revalidatePath("/")
}
