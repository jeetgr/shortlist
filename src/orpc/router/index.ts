import { publicProcedure } from "..";
import { applicationRouter } from "./application";
import { jobRouter } from "./job";
import { resumeRouter } from "./resume";
import { userRouter } from "./user";

export default {
	health: publicProcedure.handler(() => {
		return { status: "OK" };
	}),
	user: userRouter,
	resume: resumeRouter,
	application: applicationRouter,
	job: jobRouter,
};
