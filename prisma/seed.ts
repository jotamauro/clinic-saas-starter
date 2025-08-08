import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@clinic.com" },
    update: {},
    create: { email: "admin@clinic.com", name: "Admin", passwordHash: hash, role: "ADMIN" }
  });
  console.log("Seed complete: admin@clinic.com / admin123");
}
main().finally(() => prisma.$disconnect());
