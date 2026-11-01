import type { ApplicationStatus } from "#/lib/application-schemas";

export const statusLabels: Record<ApplicationStatus, string> = {
	saved: "Saved",
	applied: "Applied",
	replied: "Replied",
	interview: "Interview",
	offer: "Offer",
	rejected: "Rejected",
	withdrawn: "Withdrawn",
};

export const statusItems = Object.entries(statusLabels).map(([value, label]) => ({ value, label }));
