import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { createEmptyResume } from "#/components/resume/empty-resume";
import { ResumeForm } from "#/components/resume/resume-form";
import { useMe } from "#/hooks/use-me";
import { orpc } from "#/orpc/client";

export const Route = createFileRoute("/(app)/resume")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(context.orpc.resume.get.queryOptions());
	},
});

function RouteComponent() {
	const { data: resume } = useSuspenseQuery(orpc.resume.get.queryOptions());
	const me = useMe();

	return <ResumeForm initialResume={resume?.data ?? createEmptyResume(me.name, me.email)} />;
}
