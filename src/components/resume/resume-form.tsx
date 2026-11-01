import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type * as v from "valibot";

import { Alert, AlertDescription } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import { Spinner } from "#/components/ui/spinner";
import { useAppForm } from "#/hooks/form";
import { type Resume, resumeSchema } from "#/lib/resume-schemas";
import { orpc } from "#/orpc/client";

import { ContactSection } from "./contact-section";
import { CustomSections } from "./custom-sections";
import { EducationSection } from "./education-section";
import { ExperienceSection } from "./experience-section";
import { ProjectsSection } from "./projects-section";
import { SkillsSection } from "./skills-section";

export function ResumeForm({ initialResume }: { initialResume: Resume }) {
	const queryClient = useQueryClient();
	const saveResume = useMutation(orpc.resume.save.mutationOptions());
	const [serverError, setServerError] = useState<string | null>(null);
	const [justSaved, setJustSaved] = useState(false);

	const form = useAppForm({
		defaultValues: initialResume,
		// The form always holds every field, so it uses the output type, not the input type.
		validators: { onSubmit: resumeSchema as v.GenericSchema<Resume> },
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				await saveResume.mutateAsync(value);
				await queryClient.invalidateQueries({ queryKey: orpc.resume.get.key() });
				form.reset(value);
				setJustSaved(true);
			} catch {
				setServerError("Could not save your resume. Try again.");
			}
		},
	});

	return (
		<form
			noValidate
			className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4"
			onChange={() => setJustSaved(false)}
			onSubmit={(event) => {
				event.preventDefault();
				form.handleSubmit();
			}}
		>
			<ContactSection form={form} />
			<SkillsSection form={form} />
			<ExperienceSection form={form} />
			<ProjectsSection form={form} />
			<EducationSection form={form} />
			<CustomSections form={form} />

			<form.Subscribe
				selector={(state) => ({
					isSubmitting: state.isSubmitting,
					isDirty: state.isDirty,
					hasErrors: !state.isValid,
				})}
			>
				{({ isSubmitting, isDirty, hasErrors }) => (
					<div className="bg-background sticky bottom-4 flex flex-col gap-3 rounded-2xl border p-4">
						{serverError && (
							<Alert variant="destructive">
								<AlertDescription>{serverError}</AlertDescription>
							</Alert>
						)}
						{hasErrors && (
							<Alert variant="destructive">
								<AlertDescription>Fix the highlighted fields, then save again.</AlertDescription>
							</Alert>
						)}
						<div className="flex items-center justify-between gap-4">
							<output className="text-muted-foreground text-sm">
								{isDirty ? "Unsaved changes" : justSaved ? "Saved" : "No changes"}
							</output>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting && <Spinner />}
								Save resume
							</Button>
						</div>
					</div>
				)}
			</form.Subscribe>
		</form>
	);
}
