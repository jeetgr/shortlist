import { ORPCError } from "@orpc/server";
import type { Queue } from "bullmq";

import type { PrismaClient } from "#/generated/prisma/client";
import type { AiJobData } from "#/jobs/ai-queue";

export async function startFakeJob(db: PrismaClient, queue: Queue<AiJobData>, userId: string) {
	// One at a time per user, so repeated clicks can't fill the queue.
	const active = await db.aiJob.findFirst({
		where: { userId, type: "fake", status: { in: ["queued", "running"] } },
	});
	if (active) {
		return active;
	}

	const job = await db.aiJob.create({ data: { userId, type: "fake" } });

	try {
		// Using the row's ID as the job ID means the same job can't be queued twice.
		await queue.add(
			job.type,
			{ aiJobId: job.id },
			{ jobId: job.id, removeOnComplete: 1000, removeOnFail: 1000 },
		);
	} catch (error) {
		console.error("Could not queue job:", error instanceof Error ? error.message : error);
		await markJobFailed(db, job.id);
		throw new ORPCError("SERVICE_UNAVAILABLE", { message: "Could not start the job. Try again." });
	}

	return job;
}

export async function getJob(db: PrismaClient, userId: string, id: string) {
	const job = await db.aiJob.findFirst({ where: { id, userId } });

	if (!job) {
		// Same answer for missing and not owned, so nobody can tell whether another user's job exists.
		throw new ORPCError("NOT_FOUND", { message: "Job not found" });
	}

	return job;
}

// Includes running, because a job comes back here if its worker crashed partway through.
export async function markJobRunning(db: PrismaClient, id: string) {
	const { count } = await db.aiJob.updateMany({
		where: { id, status: { in: ["queued", "running"] } },
		data: { status: "running", attempts: { increment: 1 } },
	});
	return count > 0;
}

export async function markJobCompleted(db: PrismaClient, id: string) {
	await db.aiJob.updateMany({
		where: { id, status: "running" },
		data: { status: "completed", finishedAt: new Date() },
	});
}

export async function markJobFailed(db: PrismaClient, id: string) {
	await db.aiJob.updateMany({
		where: { id, status: { in: ["queued", "running"] } },
		data: { status: "failed", error: "This job failed. Try again.", finishedAt: new Date() },
	});
}
