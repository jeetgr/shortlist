import { ORPCError } from "@orpc/client";
import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";

import { SignOutButton } from "#/components/auth/sign-out-button";

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
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<nav className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-4 p-4">
				<Link to="/dashboard" className="hover:underline">
					Dashboard
				</Link>
				<Link to="/applications" className="hover:underline">
					Applications
				</Link>
				<Link to="/resume" className="hover:underline">
					Resume
				</Link>
				<div className="ml-auto">
					<SignOutButton />
				</div>
			</nav>
			<Outlet />
		</>
	);
}
