import { CURRENT_POLICIES_VERSION, hasAcceptedCurrentPolicies } from "@potrero/domain";
import cors from "cors";
import express, { type RequestHandler } from "express";

export interface AppDeps {
  /** Valida el token y carga req.user. Si no se pasa, /me no existe. */
  authenticate?: RequestHandler;
  /** Guarda que el usuario aceptó las políticas. Si no se pasa, /me/accept-policies no existe. */
  acceptPolicies?: (userId: string, version: string) => Promise<void>;
  /** Origenes web que pueden llamar a la API. Vacio: no se permite ningun origen. */
  corsOrigins?: string[];
  /** Verifica que la base de datos responde. Si no se pasa, /health/db no existe. */
  pingDb?: () => Promise<void>;
}

export function createApp({ pingDb, authenticate, acceptPolicies, corsOrigins = [] }: AppDeps = {}) {
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

  if (authenticate) {
    app.get("/me", authenticate, (req, res) => {
      const user = req.user!;
      res.status(200).json({ ...user, policiesAccepted: hasAcceptedCurrentPolicies(user.policiesVersion) });
    });

    if (acceptPolicies) {
      app.post("/me/accept-policies", authenticate, async (req, res, next) => {
        if (req.body?.version !== CURRENT_POLICIES_VERSION) {
          res.status(400).json({ error: "outdated_policies_version", current: CURRENT_POLICIES_VERSION });
          return;
        }
        try {
          await acceptPolicies(req.user!.id, CURRENT_POLICIES_VERSION);
          res.status(200).json({ policiesVersion: CURRENT_POLICIES_VERSION, policiesAccepted: true });
        } catch (error) {
          next(error);
        }
      });
    }
  }

  return app;
}
