import type { AuthUser } from "./auth.js";
import type { PrismaClient } from "./generated/prisma/client.js";
import type { TokenClaims } from "./tokens.js";

export type ChosenRole = "PLAYER" | "ORGANIZER";

export type ChooseRoleResult = { ok: true } | { ok: false; error: "role_already_chosen" | "region_required" };

export interface UserStore {
  upsertFromClaims(claims: TokenClaims): Promise<AuthUser & { removed: boolean }>;
  acceptPolicies(userId: string, version: string, at?: Date): Promise<void>;
  chooseRole(userId: string, role: ChosenRole): Promise<ChooseRoleResult>;
}

export function displayName(claims: TokenClaims) {
  return claims.name?.trim() || claims.email?.split("@")[0] || "Usuario";
}

export function createUserStore(prisma: Pick<PrismaClient, "user" | "organizerRequest">): UserStore {
  return {
    async upsertFromClaims(claims) {
      const user = await prisma.user.upsert({
        where: { id: claims.id },
        create: { id: claims.id, name: displayName(claims) },
        update: {},
        select: {
          id: true,
          role: true,
          policiesVersion: true,
          removedAt: true,
          organizerRequests: { where: { status: "PENDING" }, select: { id: true }, take: 1 },
        },
      });
      return {
        id: user.id,
        role: user.role,
        policiesVersion: user.policiesVersion,
        organizerRequestPending: user.organizerRequests.length > 0,
        removed: user.removedAt !== null,
      };
    },
    async acceptPolicies(userId, version, at = new Date()) {
      await prisma.user.update({
        where: { id: userId },
        data: { policiesVersion: version, policiesAcceptedAt: at },
      });
    },
    async chooseRole(userId, role) {
      if (role === "PLAYER") {
        const { count } = await prisma.user.updateMany({ where: { id: userId, role: null }, data: { role: "PLAYER" } });
        return count === 1 ? { ok: true } : { ok: false, error: "role_already_chosen" };
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { role: true, regionId: true },
      });
      if (user.role !== null) return { ok: false, error: "role_already_chosen" };
      if (!user.regionId) return { ok: false, error: "region_required" };

      const pending = await prisma.organizerRequest.findFirst({ where: { userId, status: "PENDING" }, select: { id: true } });
      if (!pending) {
        await prisma.organizerRequest.create({ data: { userId, regionId: user.regionId, description: "" } });
      }
      return { ok: true };
    },
  };
}
