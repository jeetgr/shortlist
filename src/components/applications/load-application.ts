import { ORPCError } from "@orpc/client";
import type { QueryClient } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";

import { orpc } from "#/orpc/client";

export async function loadApplication(queryClient: QueryClient, id: string) {
	try {
		await queryClient.ensureQueryData(orpc.application.get.queryOptions({ input: { id } }));
	} catch (error) {
		// A malformed ID in the URL fails validation, which also means there's nothing to show.
		if (
			error instanceof ORPCError &&
			(error.code === "NOT_FOUND" || error.code === "BAD_REQUEST")
		) {
			throw notFound();
		}
		throw error;
	}
}
