import { createFileRoute } from "@tanstack/react-router";

import { db } from "#/server/db";

export const Route = createFileRoute("/api/health")({
	server: {
		handlers: {
			GET: async () => {
				try {
					await db.$queryRaw`SELECT 1`;
					return Response.json({ status: "ok" });
				} catch (error) {
					console.error(
						"Health check failed:",
						error instanceof Error ? error.message : "unknown error",
					);
					return Response.json({ status: "error" }, { status: 503 });
				}
			},
		},
	},
});
