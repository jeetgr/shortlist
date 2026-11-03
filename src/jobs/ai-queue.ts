import { Redis, type RedisOptions } from "ioredis";

export const AI_QUEUE_NAME = "ai-jobs";

export type AiJobData = {
	aiJobId: string;
};

// BullMQ 6 makes ioredis optional, and in ESM it needs a ready-made client.
export function createRedisClient(redisUrl: string, options: RedisOptions) {
	return new Redis(redisUrl, options);
}
