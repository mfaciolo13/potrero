import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { grantOrganizer } from "./grantOrganizer.js";

const email = process.argv[2];
if (!email) {
  console.error("Uso: npm run db:seed:organizer -- <mail>");
  process.exit(1);
}

const connectionString = process.env.DIRECT_URL;
if (!connectionString) {
  console.error("Falta DIRECT_URL en apps/api/.env");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

try {
  const user = await grantOrganizer(prisma, email);
  console.log(`${user.name} (${user.id}) ahora es ${user.role}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
