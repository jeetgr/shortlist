import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { formatFollowUp } from "#/components/applications/form-values";
import { loadApplication } from "#/components/applications/load-application";
import { LocalDateTime } from "#/components/applications/local-date-time";
import { ApplicationNotFound } from "#/components/applications/not-found";
import { statusLabels } from "#/components/applications/status";
import { StatusSelect } from "#/components/applications/status-select";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { orpc } from "#/orpc/client";

export const Route = createFileRoute("/(app)/applications/$id/")({
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
	const deleteApplication = useMutation(orpc.application.delete.mutationOptions());

	async function handleDelete() {
		if (!window.confirm(`Delete ${application.title} at ${application.company}?`)) {
			return;
		}
		await deleteApplication.mutateAsync({ id });
		await navigate({ to: "/applications" });
		queryClient.removeQueries({ queryKey: orpc.application.get.queryKey({ input: { id } }) });
		await queryClient.invalidateQueries({ queryKey: orpc.application.list.key() });
	}

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="flex min-w-0 flex-col gap-1">
					<h1 className="text-2xl font-bold">{application.title}</h1>
					<p className="text-muted-foreground">{application.company}</p>
				</div>
				<StatusSelect id={application.id} status={application.status} />
			</div>

			<div className="flex flex-wrap gap-2">
				<Button
					variant="outline"
					nativeButton={false}
					render={<Link to="/applications/$id/edit" params={{ id }} />}
				>
					Edit
				</Button>
				<Button
					type="button"
					variant="destructive"
					disabled={deleteApplication.isPending}
					onClick={handleDelete}
				>
					Delete
				</Button>
			</div>

			{deleteApplication.isError && (
				<Alert variant="destructive">
					<AlertDescription>Could not delete this application. Try again.</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Details</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					{application.url && (
						<a
							href={application.url}
							target="_blank"
							rel="noopener noreferrer"
							className="break-all underline"
						>
							{application.url}
						</a>
					)}
					{application.followUpAt && <p>Follow up {formatFollowUp(application.followUpAt)}</p>}
					{application.notes && <p className="whitespace-pre-wrap">{application.notes}</p>}
					{application.jobPostText && (
						<p className="text-muted-foreground whitespace-pre-wrap">{application.jobPostText}</p>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>History</CardTitle>
				</CardHeader>
				<CardContent>
					<ol className="flex flex-col gap-2">
						{application.events.map((event) => (
							<li key={event.id} className="flex flex-wrap justify-between gap-2 text-sm">
								<span>
									{event.fromStatus
										? `${statusLabels[event.fromStatus]} to ${statusLabels[event.toStatus]}`
										: `Added as ${statusLabels[event.toStatus]}`}
								</span>
								<span className="text-muted-foreground">
									<LocalDateTime date={event.createdAt} />
								</span>
							</li>
						))}
					</ol>
				</CardContent>
			</Card>
		</div>
	);
}
