import * as v from "valibot";

const id = v.pipe(v.string(), v.nonEmpty());
const requiredText = (label: string) =>
	v.pipe(v.string(), v.trim(), v.nonEmpty(`${label} is required`));
const optionalText = v.optional(v.pipe(v.string(), v.trim()), "");
const optionalUrl = v.optional(
	v.union([v.literal(""), v.pipe(v.string(), v.trim(), v.url("Enter a valid URL"))]),
	"",
);
const yearMonth = v.pipe(v.string(), v.regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use the format YYYY-MM"));

const bulletSchema = v.object({
	id,
	text: requiredText("Bullet text"),
});

const contactSchema = v.object({
	name: requiredText("Name"),
	title: optionalText,
	email: v.pipe(v.string(), v.trim(), v.email("Enter a valid email")),
	phone: optionalText,
	location: optionalText,
	linkedin: optionalUrl,
	github: optionalUrl,
	website: optionalUrl,
});

const skillGroupSchema = v.object({
	id,
	category: requiredText("Category"),
	items: v.array(requiredText("Skill")),
});

const experienceSchema = v.object({
	id,
	title: requiredText("Job title"),
	company: requiredText("Company"),
	location: optionalText,
	startDate: yearMonth,
	// null means the person still works here.
	endDate: v.nullable(yearMonth),
	bullets: v.array(bulletSchema),
});

const projectSchema = v.object({
	id,
	name: requiredText("Project name"),
	url: optionalUrl,
	repoUrl: optionalUrl,
	bullets: v.array(bulletSchema),
});

const educationSchema = v.object({
	id,
	degree: requiredText("Degree"),
	institution: requiredText("Institution"),
	startDate: v.optional(yearMonth),
	// May be in the future for a degree still in progress.
	endDate: yearMonth,
});

const customSectionSchema = v.object({
	id,
	title: requiredText("Section title"),
	bullets: v.array(bulletSchema),
});

export const resumeSchema = v.object({
	contact: contactSchema,
	summary: optionalText,
	skills: v.array(skillGroupSchema),
	experience: v.array(experienceSchema),
	projects: v.array(projectSchema),
	education: v.array(educationSchema),
	customSections: v.optional(v.array(customSectionSchema), []),
});

export type Resume = v.InferOutput<typeof resumeSchema>;
export type ResumeInput = v.InferInput<typeof resumeSchema>;
