import { type Job, Worker } from "bullmq";

import { AI_QUEUE_NAME, type AiJobData, createRedisClient } from "#/jobs/ai-queue";
import { createDbClient } from "#/server/db-client";
import { markJobCompleted, markJobFailed, markJobRunning } from "#/server/services/job";

import { env } from "./env";
import { processFakeJob } from "./fake-processor";

const db = createDbClient(env.DATABASE_URL);

async function processJob(job: Job<AiJobData>) {
	const { aiJobId } = job.data;

	if (!(await markJobRunning(db, aiJobId))) {
		return;
	}

	switch (job.name) {
		case "fake":
			await processFakeJob();
			break;
		default:
			throw new Error(`Unknown job type: ${job.name}`);
	}

	await markJobCompleted(db, aiJobId);
}

const worker = new Worker<AiJobData>(AI_QUEUE_NAME, processJob, {
	// BullMQ's blocking commands need this, or they'd fail while Redis restarts.
	connection: createRedisClient(env.REDIS_URL, { maxRetriesPerRequest: null }),
	concurrency: 2,
});

worker.on("ready", () => console.log("Worker ready"));
worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", async (job, error) => {
	console.error(`Job ${job?.id} failed:`, error.message);
	if (job) {
		await markJobFailed(db, job.data.aiJobId).catch((dbError: unknown) => {
			console.error("Could not record the failure:", dbError);
		});
	}
});
// Without a listener, a connection error would crash the process.
worker.on("error", (error) => console.error("Worker error:", error.message));

// Finishes running jobs before exiting. Anything cut off gets picked up again after a restart.
async function shutdown() {
	await worker.close();
	await Promise.all([db.$disconnect(), worker.disconnect()]);
	process.exit(0);
}

process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
