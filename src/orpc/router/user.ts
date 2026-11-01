import { protectedProcedure } from "..";

export const userRouter = {
	me: protectedProcedure.handler(async ({ context }) => {
		return context.user;
	}),
};
