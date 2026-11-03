import { Queue } from "bullmq";

import { env } from "#/env.ts";
import { AI_QUEUE_NAME, type AiJobData, createRedisClient } from "#/jobs/ai-queue";

const globalForQueue = globalThis as unknown as { aiQueue?: Queue<AiJobData> };

// Created on first use, so building or starting the app never connects to Redis.
export function getAiQueue() {
	globalForQueue.aiQueue ??= new Queue<AiJobData>(AI_QUEUE_NAME, {
		// Fail straight away when Redis is down, so a request doesn't hang waiting for it.
		connection: createRedisClient(env.REDIS_URL, {
			enableOfflineQueue: false,
			maxRetriesPerRequest: 1,
		}),
	});
	return globalForQueue.aiQueue;
}
