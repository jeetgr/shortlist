import { resumeSchema } from "#/lib/resume-schemas";
import { db } from "#/server/db";
import { getResume, saveResume } from "#/server/services/resume";

import { protectedProcedure } from "..";

export const resumeRouter = {
	get: protectedProcedure.handler(async ({ context }) => {
		return getResume(db, context.user.id);
	}),
	save: protectedProcedure.input(resumeSchema).handler(async ({ context, input }) => {
		return saveResume(db, context.user.id, input);
	}),
};
