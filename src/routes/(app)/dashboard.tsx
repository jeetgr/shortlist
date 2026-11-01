import { createFileRoute, Link } from "@tanstack/react-router";

import { SignOutButton } from "#/components/auth/sign-out-button";
import { Button } from "#/components/ui/button";
import { useMe } from "#/hooks/use-me.ts";

export const Route = createFileRoute("/(app)/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const me = useMe();
	return (
		<div className="flex flex-col items-start gap-4 p-4">
			<p>Hello {me.name}</p>
			<Button nativeButton={false} render={<Link to="/resume" />}>
				Edit resume
			</Button>
			<SignOutButton />
		</div>
	);
}
