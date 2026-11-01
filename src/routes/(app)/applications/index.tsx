import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as v from "valibot";

import { formatFollowUp } from "#/components/applications/form-values";
import { statusItems } from "#/components/applications/status";
import { StatusSelect } from "#/components/applications/status-select";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { type ApplicationStatus, applicationStatuses } from "#/lib/application-schemas";
import { orpc } from "#/orpc/client";

const ALL = "all";
const filterItems = [{ value: ALL, label: "All statuses" }, ...statusItems];

const searchSchema = v.object({
	// A hand-edited URL with an unknown status falls back to showing everything.
	status: v.fallback(v.optional(v.picklist(applicationStatuses)), undefined),
});

export const Route = createFileRoute("/(app)/applications/")({
	validateSearch: searchSchema,
	loaderDeps: ({ search }) => ({ status: search.status }),
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(
			context.orpc.application.list.queryOptions({ input: { status: deps.status } }),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { status } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data: applications } = useSuspenseQuery(
		orpc.application.list.queryOptions({ input: { status } }),
	);

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h1 className="text-2xl font-bold">Applications</h1>
				<Button nativeButton={false} render={<Link to="/applications/new" />}>
					Add application
				</Button>
			</div>

			<Select
				items={filterItems}
				value={status ?? ALL}
				onValueChange={(value) =>
					navigate({
						search: { status: value === ALL ? undefined : (value as ApplicationStatus) },
					})
				}
			>
				<SelectTrigger className="w-44" aria-label="Filter by status">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{filterItems.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{applications.length === 0 && (
				<p className="text-muted-foreground">
					{status ? "No applications with this status." : "No applications yet."}
				</p>
			)}

			{applications.map((application) => (
				<Card key={application.id}>
					<CardContent className="flex flex-wrap items-start justify-between gap-4">
						<div className="flex min-w-0 flex-col gap-1">
							<Link
								to="/applications/$id"
								params={{ id: application.id }}
								className="font-medium hover:underline"
							>
								{application.title}
							</Link>
							<p className="text-muted-foreground text-sm">{application.company}</p>
							{application.followUpAt && (
								<p className="text-muted-foreground text-sm">
									Follow up {formatFollowUp(application.followUpAt)}
								</p>
							)}
						</div>
						<StatusSelect id={application.id} status={application.status} />
					</CardContent>
				</Card>
			))}
		</div>
	);
}
