import { publicProcedure } from "..";
import { userRouter } from "./user";

export default {
	health: publicProcedure.handler(() => {
		return { status: "OK" };
	}),
	user: userRouter,
};
