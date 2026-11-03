import { setTimeout as sleep } from "node:timers/promises";

const FAKE_JOB_MS = 10_000;

// Stands in for an AI call until step 4.4.
export async function processFakeJob() {
	await sleep(FAKE_JOB_MS);
}
