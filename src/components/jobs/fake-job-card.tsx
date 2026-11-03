import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Alert, AlertDescription } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Spinner } from "#/components/ui/spinner";
import { orpc } from "#/orpc/client";

const POLL_MS = 1000;

const statusText = {
	queued: "Waiting for the worker",
	running: "Running",
	completed: "Finished",
	failed: "Failed",
};

// Proves the queue and worker work. It gets replaced by the real job match in step 4.4.
export function FakeJobCard() {
	const [jobId, setJobId] = useState<string | null>(null);
	const startJob = useMutation(
		orpc.job.startFake.mutationOptions({ onSuccess: (job) => setJobId(job.id) }),
	);
	const { data: job } = useQuery(
		orpc.job.getStatus.queryOptions({
			input: jobId ? { id: jobId } : skipToken,
			refetchInterval: (query) => {
				const status = query.state.data?.status;
				return status === "completed" || status === "failed" ? false : POLL_MS;
			},
		}),
	);
	const isActive = job?.status === "queued" || job?.status === "running";

	return (
		<Card>
			<CardHeader>
				<CardTitle>Background job test</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col items-start gap-4">
				<Button
					type="button"
					disabled={isActive || startJob.isPending}
					onClick={() => startJob.mutate({})}
				>
					{(isActive || startJob.isPending) && <Spinner />}
					Start test job
				</Button>
				{job && <output className="text-sm">{statusText[job.status]}</output>}
				{job?.error && (
					<Alert variant="destructive">
						<AlertDescription>{job.error}</AlertDescription>
					</Alert>
				)}
				{startJob.isError && (
					<Alert variant="destructive">
						<AlertDescription>Could not start the job. Try again.</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
