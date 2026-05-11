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
  const stemTitle = (formData.get("stemTitle") as string) || null
  const stemDescription = (formData.get("stemDescription") as string) || null

  await prisma.chapter.create({
    data: {
      gradeId,
      chapterNo,
      title,
      stemVideoUrl,
      stemTitle,
      stemDescription,
      modules: {
        create: modules.map((m, index) => ({
          title: m.title || `Module ${index + 1}`,
          videoUrl: m.videoUrl || null,
          videoTitle: m.videoTitle || null,
          videoDescription: m.videoDescription || null,
          quizData: m.quizData || null,
          quizTitle: m.quizTitle || null,
          quizDescription: m.quizDescription || null,
          order: index + 1,
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
  const stemTitle = (formData.get("stemTitle") as string) || null
  const stemDescription = (formData.get("stemDescription") as string) || null

  // 1. Delete existing modules
  await prisma.chapterModule.deleteMany({ where: { chapterId } })

  // 2. Update chapter details and recreate modules
  await prisma.chapter.update({
    where: { id: chapterId },
    data: {
      chapterNo,
      title,
      stemVideoUrl,
      stemTitle,
      stemDescription,
      modules: {
        create: modules.map((m, index) => ({
          title: m.title || `Module ${index + 1}`,
          videoUrl: m.videoUrl || null,
          videoTitle: m.videoTitle || null,
          videoDescription: m.videoDescription || null,
          quizData: m.quizData || null,
          quizTitle: m.quizTitle || null,
          quizDescription: m.quizDescription || null,
          order: index + 1,
        })),
      },
    },
  })

  revalidatePath(`/admin/grade/${gradeId}`)
  revalidatePath(`/grade`)
}

export async function deleteChapter(chapterId: string, gradeId: string) {
  await prisma.chapterModule.deleteMany({ where: { chapterId } })
  await prisma.chapter.delete({ where: { id: chapterId } })

  revalidatePath(`/admin/grade/${gradeId}`)
}

export async function deleteGrade(gradeId: string) {
  // Delete all associated chapters and modules
  const chapters = await prisma.chapter.findMany({ where: { gradeId } })

  for (const chapter of chapters) {
    await prisma.chapterModule.deleteMany({ where: { chapterId: chapter.id } })
  }

  await prisma.chapter.deleteMany({ where: { gradeId } })
  await prisma.grade.delete({ where: { id: gradeId } })

  revalidatePath("/admin")
  revalidatePath("/")
}
