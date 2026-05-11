import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrate() {
  console.log("🚀 Starting smart migration...");

  // 1. Migrate Quiz data to quizData JSON field
  const modules = await prisma.chapterModule.findMany({
    include: {
      quiz: {
        include: {
          questions: true,
        },
      },
    },
  });

  console.log(`Found ${modules.length} modules to check.`);

  let quizCount = 0;
  for (const module of modules) {
    if (module.quiz && !module.quizData) {
      const quizData = {
        title: module.quiz.title,
        totalQuestions: module.quiz.totalQuestions,
        questions: module.quiz.questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          hint: q.hint,
        })),
      };

      await prisma.chapterModule.update({
        where: { id: module.id },
        data: { quizData },
      });
      quizCount++;
      console.log(`✅ Migrated quiz for module: ${module.title || module.id}`);
    }
  }

  console.log(`\n🎉 Successfully migrated ${quizCount} modules to JSON quiz data.`);
  console.log("You can now safely remove the Quiz and Question models from schema.prisma and run npx prisma db push.");
}

migrate()
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
