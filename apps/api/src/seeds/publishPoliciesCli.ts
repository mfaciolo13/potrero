import { readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { publishPolicies } from "./publishPolicies.js";

const [version, file] = process.argv.slice(2);
if (!version || !file) {
  console.error("Uso: npm run db:publish-policies -- <version> <archivo.json>");
  process.exit(1);
}

const connectionString = process.env.DIRECT_URL;
if (!connectionString) {
  console.error("Falta DIRECT_URL en apps/api/.env");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

try {
  const published = await publishPolicies(prisma, version, JSON.parse(readFileSync(file, "utf8")));
  console.log(`La versión vigente de las políticas es ${published.id}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
