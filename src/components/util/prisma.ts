import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;

export const seedDatabase = async () => {
  const response = await fetch("/api/seedStudents", {
    method: "POST",
  });
  const data = await response.json();
  console.log(data);
};
