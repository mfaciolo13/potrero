import type { PrismaClient } from "../generated/prisma/client.js";
import { policyDocumentsSchema } from "../legal.js";

type Db = Pick<PrismaClient, "policyVersion" | "$transaction">;

export async function publishPolicies(prisma: Db, version: string, documents: unknown) {
  const id = version.trim();
  if (!id) throw new Error("La versión no puede estar vacía");
  const parsed = policyDocumentsSchema.parse(documents);

  return prisma.$transaction(async (tx) => {
    await tx.policyVersion.updateMany({ where: { current: true, NOT: { id } }, data: { current: false } });
    return tx.policyVersion.upsert({
      where: { id },
      create: { id, current: true, documents: parsed },
      update: { current: true, documents: parsed },
      select: { id: true, publishedAt: true, current: true },
    });
  });
}
