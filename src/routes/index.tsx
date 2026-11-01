import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SignOutButton } from "#/components/auth/sign-out-button";
import { Button } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";
import { orpc } from "#/orpc/client";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { data: session, isPending } = authClient.useSession();
	const health = useQuery(orpc.health.queryOptions());

	return (
		<main className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
			<h1 className="text-4xl font-bold">Shortlist</h1>
			{isPending ? null : session ? (
				<>
					<p className="text-muted-foreground">Signed in as {session.user.email}</p>
					<SignOutButton />
				</>
			) : (
				<Button nativeButton={false} render={<Link to="/sign-in" />}>
					Sign in
				</Button>
			)}
			<p className="text-muted-foreground text-sm">
				API status: {health.data?.status ?? "checking"}
			</p>
		</main>
	);
}
