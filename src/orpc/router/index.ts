import { os } from "@orpc/server";

export default {
	health: os.handler(() => {
		return { status: "OK" };
	}),
};
