import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ApplicationForm } from "#/components/applications/application-form";
import { emptyApplication, toApplicationInput } from "#/components/applications/form-values";
import { orpc } from "#/orpc/client";

export const Route = createFileRoute("/(app)/applications/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const queryClient = useQueryClient();
	const createApplication = useMutation(orpc.application.create.mutationOptions());

	return (
		<div className="mx-auto w-full max-w-3xl p-4">
			<ApplicationForm
				title="Add application"
				submitLabel="Add application"
				initialValues={emptyApplication}
				onSubmit={async (values) => {
					const { id } = await createApplication.mutateAsync(toApplicationInput(values));
					await queryClient.invalidateQueries({ queryKey: orpc.application.key() });
					await navigate({ to: "/applications/$id", params: { id } });
				}}
			/>
		</div>
	);
}
