import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const env = createEnv({
	/*
	 * Server-side environment variables.
	 * These will throw an error if accessed on the client.
	 */
	server: {
		NODE_ENV: v.optional(v.picklist(["development", "production", "test"]), "development"),
		DATABASE_URL: v.pipe(v.string(), v.url()),
		REDIS_URL: v.pipe(v.string(), v.url()),
	},

	/*
	 * Destructure the actual runtime variables here.
	 * Because of how Vite bundles code, you must explicitly write out the keys.
	 */
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		REDIS_URL: process.env.REDIS_URL,
	},

	emptyStringAsUndefined: true,
});
