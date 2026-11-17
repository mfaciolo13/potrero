import type { PrismaClient } from "../generated/prisma/client.js";
import { displayName } from "../users.js";

type Db = Pick<PrismaClient, "user" | "$queryRaw">;

export async function grantOrganizer(prisma: Db, email: string) {
  const normalized = email.trim().toLowerCase();
  const found = await prisma.$queryRaw<{ id: string; name: string | null }[]>`
    SELECT id::text AS id, raw_user_meta_data ->> 'name' AS name
    FROM auth.users
    WHERE lower(email) = ${normalized}
  `;
  const authUser = found[0];
  if (!authUser) {
    throw new Error(`No hay ninguna cuenta con el mail ${normalized}. Creala primero desde la app.`);
  }

  return prisma.user.upsert({
    where: { id: authUser.id },
    create: { id: authUser.id, name: displayName({ id: authUser.id, name: authUser.name ?? undefined, email: normalized }), role: "ORGANIZER" },
    update: { role: "ORGANIZER" },
    select: { id: true, name: true, role: true },
  });
}
