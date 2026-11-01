import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import type { ApplicationStatus } from "#/lib/application-schemas";
import { client, orpc } from "#/orpc/client";

import { statusItems } from "./status";

type ApplicationList = Awaited<ReturnType<typeof client.application.list>>;

function useChangeStatus(id: string) {
	const queryClient = useQueryClient();
	const detailKey = orpc.application.get.queryKey({ input: { id } });
	const listKey = orpc.application.list.key();

	return useMutation(
		orpc.application.changeStatus.mutationOptions({
			onMutate: async ({ status }) => {
				// A refetch already in flight could overwrite the optimistic status.
				await queryClient.cancelQueries({ queryKey: orpc.application.key() });

				const previousDetail = queryClient.getQueryData(detailKey);
				const previousLists = queryClient.getQueriesData<ApplicationList>({ queryKey: listKey });

				queryClient.setQueryData(detailKey, (old) => old && { ...old, status });
				queryClient.setQueriesData<ApplicationList>({ queryKey: listKey }, (old) =>
					old?.map((application) =>
						application.id === id ? { ...application, status } : application,
					),
				);

				return { previousDetail, previousLists };
			},
			onError: (_error, _input, snapshot) => {
				if (!snapshot) {
					return;
				}
				queryClient.setQueryData(detailKey, snapshot.previousDetail);
				for (const [key, list] of snapshot.previousLists) {
					queryClient.setQueryData(key, list);
				}
			},
			onSettled: () => queryClient.invalidateQueries({ queryKey: orpc.application.key() }),
		}),
	);
}

type StatusSelectProps = {
	id: string;
	status: ApplicationStatus;
};

export function StatusSelect({ id, status }: StatusSelectProps) {
	const changeStatus = useChangeStatus(id);

	return (
		<div className="flex flex-col gap-1">
			<Select
				items={statusItems}
				value={status}
				onValueChange={(value) => {
					if (value && value !== status) {
						changeStatus.mutate({ id, status: value as ApplicationStatus });
					}
				}}
			>
				<SelectTrigger className="w-36" aria-label="Status">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{statusItems.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{changeStatus.isError && (
				<p className="text-destructive text-sm" role="alert">
					Could not change the status. Try again.
				</p>
			)}
		</div>
	);
}
