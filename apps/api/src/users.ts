import type { AuthUser } from "./auth.js";
import type { PrismaClient } from "./generated/prisma/client.js";
import type { TokenClaims } from "./tokens.js";

export interface UserStore {
  upsertFromClaims(claims: TokenClaims): Promise<AuthUser & { removed: boolean }>;
  acceptPolicies(userId: string, version: string, at?: Date): Promise<void>;
}

export function displayName(claims: TokenClaims) {
  return claims.name?.trim() || claims.email?.split("@")[0] || "Usuario";
}

export function createUserStore(prisma: Pick<PrismaClient, "user">): UserStore {
  return {
    async upsertFromClaims(claims) {
      const user = await prisma.user.upsert({
        where: { id: claims.id },
        create: { id: claims.id, name: displayName(claims) },
        update: {},
        select: { id: true, role: true, policiesVersion: true, removedAt: true },
      });
      return {
        id: user.id,
        role: user.role,
        policiesVersion: user.policiesVersion,
        removed: user.removedAt !== null,
      };
    },
    async acceptPolicies(userId, version, at = new Date()) {
      await prisma.user.update({
        where: { id: userId },
        data: { policiesVersion: version, policiesAcceptedAt: at },
      });
    },
  };
}
