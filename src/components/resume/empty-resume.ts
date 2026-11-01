import type { Resume } from "#/lib/resume-schemas";

export function createEmptyResume(name = "", email = ""): Resume {
	return {
		contact: {
			name,
			title: "",
			email,
			phone: "",
			location: "",
			linkedin: "",
			github: "",
			website: "",
		},
		summary: "",
		skills: [],
		experience: [],
		projects: [],
		education: [],
		customSections: [],
	};
}

export function newBullet() {
	return { id: crypto.randomUUID(), text: "" };
}

export function newSkillGroup() {
	return { id: crypto.randomUUID(), category: "", items: [] };
}

export function newExperience() {
	return {
		id: crypto.randomUUID(),
		title: "",
		company: "",
		location: "",
		startDate: "",
		endDate: "",
		bullets: [newBullet()],
	};
}

export function newProject() {
	return { id: crypto.randomUUID(), name: "", url: "", repoUrl: "", bullets: [newBullet()] };
}

export function newEducation() {
	return {
		id: crypto.randomUUID(),
		degree: "",
		institution: "",
		startDate: undefined,
		endDate: "",
	};
}

export function newCustomSection() {
	return { id: crypto.randomUUID(), title: "", bullets: [newBullet()] };
}
