import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)")({
	beforeLoad: async ({ context: { queryClient, orpc } }) => {
		const isAuthed = await queryClient
			.query(orpc.user.me.queryOptions())
			.then(() => true)
			.catch(() => false);

		if (!isAuthed) {
			throw redirect({ to: "/sign-in" });
		}
	},
});
