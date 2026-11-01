import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ApplicationForm } from "#/components/applications/application-form";
import { toApplicationInput, toFormValues } from "#/components/applications/form-values";
import { loadApplication } from "#/components/applications/load-application";
import { ApplicationNotFound } from "#/components/applications/not-found";
import { orpc } from "#/orpc/client";

export const Route = createFileRoute("/(app)/applications/$id/edit")({
	loader: ({ context, params }) => loadApplication(context.queryClient, params.id),
	notFoundComponent: ApplicationNotFound,
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const navigate = Route.useNavigate();
	const queryClient = useQueryClient();
	const { data: application } = useSuspenseQuery(
		orpc.application.get.queryOptions({ input: { id } }),
	);
	const updateApplication = useMutation(orpc.application.update.mutationOptions());

	return (
		<div className="mx-auto w-full max-w-3xl p-4">
			<ApplicationForm
				title="Edit application"
				submitLabel="Save changes"
				initialValues={toFormValues(application)}
				onSubmit={async (values) => {
					await updateApplication.mutateAsync({ id, ...toApplicationInput(values) });
					await queryClient.invalidateQueries({ queryKey: orpc.application.key() });
					await navigate({ to: "/applications/$id", params: { id } });
				}}
			/>
		</div>
	);
}
