import { ORPCError } from "@orpc/server";

import type { PrismaClient } from "#/generated/prisma/client";
import type {
	ApplicationStatus,
	CreateApplicationInput,
	ListApplicationsInput,
	UpdateApplicationInput,
} from "#/lib/application-schemas";

// Used for both missing and not owned, so nobody can tell whether another user's application exists.
function notFound() {
	return new ORPCError("NOT_FOUND", { message: "Application not found" });
}

export async function listApplications(
	db: PrismaClient,
	userId: string,
	{ status }: ListApplicationsInput,
) {
	return db.application.findMany({
		where: { userId, status },
		// Job posts can be long, and only the detail page needs them.
		omit: { jobPostText: true },
		orderBy: { updatedAt: "desc" },
	});
}

export async function getApplication(db: PrismaClient, userId: string, id: string) {
	const application = await db.application.findFirst({
		where: { id, userId },
		include: { events: { orderBy: { createdAt: "asc" } } },
	});

	if (!application) {
		throw notFound();
	}

	return application;
}

export async function createApplication(
	db: PrismaClient,
	userId: string,
	data: CreateApplicationInput,
) {
	return db.application.create({
		data: {
			...data,
			userId,
			events: { create: { toStatus: "saved" } },
		},
	});
}

export async function updateApplication(
	db: PrismaClient,
	userId: string,
	{ id, ...data }: UpdateApplicationInput,
) {
	const [application] = await db.application.updateManyAndReturn({
		where: { id, userId },
		data,
	});

	if (!application) {
		throw notFound();
	}

	return application;
}

export async function changeApplicationStatus(
	db: PrismaClient,
	userId: string,
	id: string,
	status: ApplicationStatus,
) {
	return db.$transaction(async (tx) => {
		const current = await tx.application.findFirst({ where: { id, userId } });

		if (!current) {
			throw notFound();
		}

		if (current.status === status) {
			return current;
		}

		// Matching the old status stops two requests at once from recording the wrong history.
		const [application] = await tx.application.updateManyAndReturn({
			where: { id, userId, status: current.status },
			data: { status },
		});

		if (!application) {
			throw new ORPCError("CONFLICT", { message: "Application status just changed. Try again." });
		}

		await tx.applicationEvent.create({
			data: { applicationId: id, fromStatus: current.status, toStatus: status },
		});

		return application;
	});
}

export async function deleteApplication(db: PrismaClient, userId: string, id: string) {
	const { count } = await db.application.deleteMany({ where: { id, userId } });

	if (count === 0) {
		throw notFound();
	}
}
