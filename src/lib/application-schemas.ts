import * as v from "valibot";

export const applicationStatuses = [
	"saved",
	"applied",
	"replied",
	"interview",
	"offer",
	"rejected",
	"withdrawn",
] as const;

const requiredText = (label: string) =>
	v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty(`${label} is required`),
		v.maxLength(200, `${label} is too long`),
	);
const emptyToNull = (text: string) => (text === "" ? null : text);
const nullableText = (label: string, max: number) =>
	v.nullable(
		v.pipe(
			v.string(),
			v.trim(),
			v.maxLength(max, `${label} is too long`),
			v.transform(emptyToNull),
		),
	);
const nullableUrl = v.nullable(
	v.pipe(
		v.string(),
		v.trim(),
		v.maxLength(2048, "URL is too long"),
		v.transform(emptyToNull),
		v.nullable(
			v.pipe(
				v.string(),
				v.url("Enter a valid URL"),
				// v.url alone accepts javascript: links, which are unsafe to render.
				v.regex(/^https?:\/\//i, "Enter a valid URL"),
			),
		),
	),
);

const applicationId = v.pipe(v.string(), v.uuid());
const applicationStatus = v.picklist(applicationStatuses);

const applicationFields = v.object({
	company: requiredText("Company"),
	title: requiredText("Job title"),
	url: nullableUrl,
	jobPostText: nullableText("Job post", 50_000),
	notes: nullableText("Notes", 10_000),
	followUpAt: v.nullable(v.date()),
});

export const applicationIdSchema = v.object({ id: applicationId });

export const listApplicationsSchema = v.object({
	status: v.optional(applicationStatus),
});

export const createApplicationSchema = v.partial(applicationFields, [
	"url",
	"jobPostText",
	"notes",
	"followUpAt",
]);

// A field left out stays unchanged, and null clears it.
export const updateApplicationSchema = v.object({
	id: applicationId,
	...v.partial(applicationFields).entries,
});

export const changeApplicationStatusSchema = v.object({
	id: applicationId,
	status: applicationStatus,
});

export type ApplicationStatus = v.InferOutput<typeof applicationStatus>;
export type ListApplicationsInput = v.InferOutput<typeof listApplicationsSchema>;
export type CreateApplicationInput = v.InferOutput<typeof createApplicationSchema>;
export type UpdateApplicationInput = v.InferOutput<typeof updateApplicationSchema>;
