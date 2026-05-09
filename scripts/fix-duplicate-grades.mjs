import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function reassignGrades() {
  // These are the 4 duplicate grade=1 records ordered by creation time
  // We'll assign them 1.1, 1.2, 1.3, 1.4
  const assignments = [
    { id: "69ff0c85c0b4a5fd7dd5f20f", newGrade: 1.1 },
    { id: "69ff0cd857dd32d64da0f1c1", newGrade: 1.2 },
    { id: "69ff0d1700dae8b8d52a70f8", newGrade: 1.3 },
    { id: "69ff0de657dd32d64da0f1c2", newGrade: 1.4 },
  ];

  console.log("Reassigning grade values...\n");

  for (const { id, newGrade } of assignments) {
    const updated = await prisma.grade.update({
      where: { id },
      data: { grade: newGrade },
    });
    console.log(`✅ Updated "${updated.title}" → grade: ${updated.grade}`);
  }

  console.log("\nDone! Now run: npx prisma db push");
}

reassignGrades()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
