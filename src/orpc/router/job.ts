import * as v from "valibot";

import { db } from "#/server/db";
import { getAiQueue } from "#/server/queue";
import { getJob, startFakeJob } from "#/server/services/job";

import { protectedProcedure } from "..";

const jobIdSchema = v.object({ id: v.pipe(v.string(), v.uuid()) });

export const jobRouter = {
	startFake: protectedProcedure.handler(async ({ context }) => {
		return startFakeJob(db, getAiQueue(), context.user.id);
	}),
	getStatus: protectedProcedure.input(jobIdSchema).handler(async ({ context, input }) => {
		return getJob(db, context.user.id, input.id);
	}),
};
