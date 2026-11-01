import { ORPCError, os } from "@orpc/server";

import { auth } from "#/server/auth.ts";

const base = os.$context<{ headers: Headers }>();

const requireAuth = base.middleware(async ({ context, next }) => {
	const session = await auth.api.getSession({ headers: context.headers });

	if (!session) {
		throw new ORPCError("UNAUTHORIZED");
	}

	return next({
		context: {
			session: session.session,
			user: session.user,
		},
	});
});

export const publicProcedure = base;

export const protectedProcedure = base.use(requireAuth);
