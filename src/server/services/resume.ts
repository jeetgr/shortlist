import * as v from "valibot";

import type { Prisma } from "#/generated/prisma/client";
import { resumeSchema, type Resume } from "#/lib/resume-schemas";

export async function getResume(db: Prisma.TransactionClient, userId: string) {
	const dbResume = await db.resume.findUnique({
		where: { userId },
	});

	if (!dbResume) {
		return null;
	}

	const { data, ...rest } = dbResume;

	const parsed = v.parse(resumeSchema, data);

	return {
		...rest,
		data: parsed,
	};
}

export async function saveResume(db: Prisma.TransactionClient, userId: string, data: Resume) {
	return await db.resume.upsert({
		where: { userId },
		create: { userId, data },
		update: { data },
	});
}
