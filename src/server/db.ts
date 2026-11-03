import { env } from "#/env.ts";
import type { PrismaClient } from "#/generated/prisma/client";

import { createDbClient } from "./db-client";

// Dev reloads re-run this module, so reuse one client instead of opening a new pool each time.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createDbClient(env.DATABASE_URL);

if (env.NODE_ENV !== "production") {
	globalForPrisma.prisma = db;
}
