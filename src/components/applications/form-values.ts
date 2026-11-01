import type { ApplicationFormValues } from "#/lib/application-schemas";

type StoredApplication = {
	company: string;
	title: string;
	url: string | null;
	jobPostText: string | null;
	notes: string | null;
	followUpAt: Date | null;
};

export const emptyApplication: ApplicationFormValues = {
	company: "",
	title: "",
	url: "",
	jobPostText: "",
	notes: "",
	followUpAt: "",
};

// A follow-up is a calendar day, so it's stored as midnight UTC and always read back in UTC.
export function toFormValues(application: StoredApplication): ApplicationFormValues {
	return {
		company: application.company,
		title: application.title,
		url: application.url ?? "",
		jobPostText: application.jobPostText ?? "",
		notes: application.notes ?? "",
		followUpAt: application.followUpAt?.toISOString().slice(0, 10) ?? "",
	};
}

export function toApplicationInput(values: ApplicationFormValues) {
	return {
		...values,
		followUpAt: values.followUpAt ? new Date(`${values.followUpAt}T00:00:00.000Z`) : null,
	};
}

export function formatFollowUp(date: Date) {
	return date.toLocaleDateString("en", { dateStyle: "medium", timeZone: "UTC" });
}
