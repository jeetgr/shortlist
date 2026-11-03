import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

// Separate from src/env.ts, so the worker never receives the auth or Google secrets.
export const env = createEnv({
	server: {
		DATABASE_URL: v.pipe(v.string(), v.url()),
		REDIS_URL: v.pipe(v.string(), v.url()),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		REDIS_URL: process.env.REDIS_URL,
	},
	emptyStringAsUndefined: true,
});
