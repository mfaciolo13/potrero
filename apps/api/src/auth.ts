import { hasAcceptedPolicies } from "@potrero/domain";
import type { RequestHandler } from "express";
import type { UserRole } from "./generated/prisma/enums.js";
import { errors } from "jose";
import type { CurrentPoliciesVersion } from "./policies.js";
import type { VerifyToken } from "./tokens.js";
import type { UserStore } from "./users.js";

export interface AuthUser {
  id: string;
  role: UserRole | null;
  policiesVersion: string | null;
  organizerRequestPending: boolean;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

export function requireRole(...roles: UserRole[]): RequestHandler {
  if (roles.length === 0) throw new Error("requireRole necesita al menos un rol");

  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "unauthenticated" });
      return;
    }
    if (!req.user.role || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "forbidden" });
      return;
    }
    next();
  };
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** Bloquea las escrituras de quien no aceptó la versión vigente de las políticas. Va después de `authenticate`. */
export function requireAcceptedPolicies(currentVersion: CurrentPoliciesVersion): RequestHandler {
  return async (req, res, next) => {
    if (SAFE_METHODS.has(req.method)) {
      next();
      return;
    }
    if (!req.user) {
      res.status(401).json({ error: "unauthenticated" });
      return;
    }
    try {
      if (!hasAcceptedPolicies(req.user.policiesVersion, await currentVersion())) {
        res.status(403).json({ error: "policies_not_accepted" });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function authenticate(verifyToken: VerifyToken, users: UserStore): RequestHandler {
  return async (req, res, next) => {
    const [scheme, token] = req.header("authorization")?.split(" ") ?? [];
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      res.status(401).json({ error: "unauthenticated" });
      return;
    }

    try {
      const claims = await verifyToken(token);
      const { removed, ...user } = await users.upsertFromClaims(claims);
      if (removed) {
        res.status(403).json({ error: "forbidden" });
        return;
      }
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof errors.JOSEError) {
        res.status(401).json({ error: "unauthenticated" });
        return;
      }
      next(error);
    }
  };
}
