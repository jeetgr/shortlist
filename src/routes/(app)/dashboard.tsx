import { createFileRoute } from "@tanstack/react-router";

import { FakeJobCard } from "#/components/jobs/fake-job-card";
import { useMe } from "#/hooks/use-me.ts";

export const Route = createFileRoute("/(app)/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const me = useMe();
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
			<p>Hello {me.name}</p>
			<FakeJobCard />
		</div>
	);
}
