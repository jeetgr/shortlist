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
		BETTER_AUTH_SECRET: v.pipe(v.string(), v.minLength(32)),
		BETTER_AUTH_URL: v.pipe(v.string(), v.url()),
		GOOGLE_CLIENT_ID: v.pipe(v.string(), v.minLength(1)),
		GOOGLE_CLIENT_SECRET: v.pipe(v.string(), v.minLength(1)),
	},

	/*
	 * Destructure the actual runtime variables here.
	 * Because of how Vite bundles code, you must explicitly write out the keys.
	 */
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		REDIS_URL: process.env.REDIS_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	},

	emptyStringAsUndefined: true,
});
