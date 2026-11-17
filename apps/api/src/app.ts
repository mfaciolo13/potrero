import { hasAcceptedPolicies } from "@potrero/domain";
import cors from "cors";
import express, { type RequestHandler } from "express";
import type { CurrentPoliciesVersion, GetCurrentPolicies } from "./policies.js";

export interface AppDeps {
  /** Valida el token y carga req.user. Si no se pasa, /me no existe. */
  authenticate?: RequestHandler;
  /** Lee la versión vigente de las políticas. Si no se pasa, /me y /me/accept-policies no existen. */
  currentPoliciesVersion?: CurrentPoliciesVersion;
  /** Lee la versión vigente de las políticas con su texto. Si no se pasa, /policies/current no existe. */
  currentPolicies?: GetCurrentPolicies;
  /** Guarda que el usuario aceptó las políticas. Si no se pasa, /me/accept-policies no existe. */
  acceptPolicies?: (userId: string, version: string) => Promise<void>;
  /** Origenes web que pueden llamar a la API. Vacio: no se permite ningun origen. */
  corsOrigins?: string[];
  /** Verifica que la base de datos responde. Si no se pasa, /health/db no existe. */
  pingDb?: () => Promise<void>;
}

export function createApp({
  pingDb,
  authenticate,
  currentPoliciesVersion,
  currentPolicies,
  acceptPolicies,
  corsOrigins = [],
}: AppDeps = {}) {
  const app = express();

  app.use(cors({ origin: corsOrigins, allowedHeaders: ["Authorization", "Content-Type"] }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  if (pingDb) {
    app.get("/health/db", async (_req, res) => {
      try {
        await pingDb();
        res.status(200).json({ status: "ok", db: "ok" });
      } catch {
        res.status(503).json({ status: "error", db: "unreachable" });
      }
    });
  }

  if (currentPolicies) {
    app.get("/policies/current", async (_req, res, next) => {
      try {
        res.status(200).json(await currentPolicies());
      } catch (error) {
        next(error);
      }
    });
  }

  if (authenticate && currentPoliciesVersion) {
    app.get("/me", authenticate, async (req, res, next) => {
      try {
        const user = req.user!;
        const current = await currentPoliciesVersion();
        res.status(200).json({
          ...user,
          policiesAccepted: hasAcceptedPolicies(user.policiesVersion, current),
          currentPoliciesVersion: current,
        });
      } catch (error) {
        next(error);
      }
    });

    if (acceptPolicies) {
      app.post("/me/accept-policies", authenticate, async (req, res, next) => {
        try {
          const current = await currentPoliciesVersion();
          if (req.body?.version !== current) {
            res.status(400).json({ error: "outdated_policies_version", current });
            return;
          }
          await acceptPolicies(req.user!.id, current);
          res.status(200).json({ policiesVersion: current, policiesAccepted: true });
        } catch (error) {
          next(error);
        }
      });
    }
  }

  return app;
}
