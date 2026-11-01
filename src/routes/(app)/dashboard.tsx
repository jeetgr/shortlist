import { createFileRoute } from "@tanstack/react-router";

import { useMe } from "#/hooks/use-me.ts";

export const Route = createFileRoute("/(app)/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const me = useMe();
	return <div>Hello {me.name}</div>;
}
