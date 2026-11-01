import { ORPCError } from "@orpc/client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)")({
	beforeLoad: async ({ context: { queryClient, orpc } }) => {
		try {
			await queryClient.query(orpc.user.me.queryOptions());
		} catch (error) {
			if (error instanceof ORPCError && error.code === "UNAUTHORIZED") {
				throw redirect({ to: "/sign-in" });
			}
			throw error;
		}
	},
});
