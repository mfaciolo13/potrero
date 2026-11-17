import type { PrismaClient } from "./generated/prisma/client.js";
import type { PolicyDocuments } from "./legal.js";

export type CurrentPoliciesVersion = () => Promise<string>;

export interface CurrentPolicies {
  version: string;
  publishedAt: Date;
  documents: PolicyDocuments;
}

export type GetCurrentPolicies = () => Promise<CurrentPolicies>;

const NO_CURRENT = "No hay una versión vigente de las políticas en la base";

export function createCurrentPoliciesVersion(prisma: Pick<PrismaClient, "policyVersion">): CurrentPoliciesVersion {
  return async () => {
    const current = await prisma.policyVersion.findFirst({ where: { current: true }, select: { id: true } });
    if (!current) throw new Error(NO_CURRENT);
    return current.id;
  };
}

export function createCurrentPolicies(prisma: Pick<PrismaClient, "policyVersion">): GetCurrentPolicies {
  return async () => {
    const current = await prisma.policyVersion.findFirst({ where: { current: true } });
    if (!current) throw new Error(NO_CURRENT);
    return { version: current.id, publishedAt: current.publishedAt, documents: current.documents as PolicyDocuments };
  };
}
