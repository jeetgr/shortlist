import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "#/env.ts";
import { PrismaClient } from "#/generated/prisma/client";

function createClient() {
	const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
	return new PrismaClient({ adapter });
}

// Dev reloads re-run this module, so reuse one client instead of opening a new pool each time.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createClient();

if (env.NODE_ENV !== "production") {
	globalForPrisma.prisma = db;
}
