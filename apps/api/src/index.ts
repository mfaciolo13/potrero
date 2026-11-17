import { createApp } from "./app.js";
import { authenticate } from "./auth.js";
import { prisma } from "./db.js";
import { env } from "./env.js";
import { createCurrentPolicies, createCurrentPoliciesVersion } from "./policies.js";
import { createTokenVerifier } from "./tokens.js";
import { createUserStore } from "./users.js";

const users = createUserStore(prisma);

const app = createApp({
  pingDb: async () => {
    await prisma.$queryRaw`SELECT 1`;
  },
  corsOrigins: env.CORS_ORIGINS,
  currentPoliciesVersion: createCurrentPoliciesVersion(prisma),
  currentPolicies: createCurrentPolicies(prisma),
  authenticate: authenticate(createTokenVerifier(env.SUPABASE_URL), users),
  acceptPolicies: (userId, version) => users.acceptPolicies(userId, version),
});

app.listen(env.PORT, () => {
  console.log(`API escuchando en http://localhost:${env.PORT}`);
});
