import { createFileRoute } from "@tanstack/react-router";

import { useMe } from "#/hooks/use-me.ts";

export const Route = createFileRoute("/(app)/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const me = useMe();
	return <div className="mx-auto w-full max-w-3xl p-4">Hello {me.name}</div>;
}
