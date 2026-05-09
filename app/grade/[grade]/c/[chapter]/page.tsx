import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ChapterContent } from "./ChapterContent";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ grade: string; chapter: string }>;
}) {
  const { grade: gradeParam, chapter: chapterParam } = await params;
  const gradeFloat = parseFloat(gradeParam);
  const chapterNo = parseInt(chapterParam);

  const chapter = await prisma.chapter.findFirst({
    where: {
      grade: { grade: gradeFloat },
      chapterNo: chapterNo,
    },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          quiz: {
            include: {
              questions: true,
            },
          },
        },
      },
      grade: true,
    },
  });

  if (!chapter) {
    return notFound();
  }

  return (
    <ChapterContent 
      chapter={chapter} 
    />
  );
}
