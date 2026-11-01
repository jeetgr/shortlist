import {
	applicationIdSchema,
	changeApplicationStatusSchema,
	createApplicationSchema,
	listApplicationsSchema,
	updateApplicationSchema,
} from "#/lib/application-schemas";
import { db } from "#/server/db";
import {
	changeApplicationStatus,
	createApplication,
	deleteApplication,
	getApplication,
	listApplications,
	updateApplication,
} from "#/server/services/application";

import { protectedProcedure } from "..";

export const applicationRouter = {
	list: protectedProcedure.input(listApplicationsSchema).handler(async ({ context, input }) => {
		return listApplications(db, context.user.id, input);
	}),
	get: protectedProcedure.input(applicationIdSchema).handler(async ({ context, input }) => {
		return getApplication(db, context.user.id, input.id);
	}),
	create: protectedProcedure.input(createApplicationSchema).handler(async ({ context, input }) => {
		return createApplication(db, context.user.id, input);
	}),
	update: protectedProcedure.input(updateApplicationSchema).handler(async ({ context, input }) => {
		return updateApplication(db, context.user.id, input);
	}),
	changeStatus: protectedProcedure
		.input(changeApplicationStatusSchema)
		.handler(async ({ context, input }) => {
			return changeApplicationStatus(db, context.user.id, input.id, input.status);
		}),
	delete: protectedProcedure.input(applicationIdSchema).handler(async ({ context, input }) => {
		await deleteApplication(db, context.user.id, input.id);
	}),
};
