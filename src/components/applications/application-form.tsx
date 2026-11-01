import { useState } from "react";

import { Alert, AlertDescription } from "#/components/ui/alert";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "#/components/ui/card";
import { FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { type ApplicationFormValues, applicationFormSchema } from "#/lib/application-schemas";

type ApplicationFormProps = {
	title: string;
	submitLabel: string;
	initialValues: ApplicationFormValues;
	onSubmit: (values: ApplicationFormValues) => Promise<void>;
};

export function ApplicationForm({
	title,
	submitLabel,
	initialValues,
	onSubmit,
}: ApplicationFormProps) {
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useAppForm({
		defaultValues: initialValues,
		validators: { onSubmit: applicationFormSchema },
		onSubmit: async ({ value }) => {
			setServerError(null);
			try {
				await onSubmit(value);
			} catch {
				setServerError("Could not save this application. Try again.");
			}
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<form
				noValidate
				onSubmit={(event) => {
					event.preventDefault();
					form.handleSubmit();
				}}
			>
				<CardContent>
					<FieldGroup>
						{serverError && (
							<Alert variant="destructive">
								<AlertDescription>{serverError}</AlertDescription>
							</Alert>
						)}
						<form.AppField name="company">
							{(field) => <field.TextField label="Company" />}
						</form.AppField>
						<form.AppField name="title">
							{(field) => <field.TextField label="Job title" />}
						</form.AppField>
						<form.AppField name="url">
							{(field) => <field.TextField label="Job URL" type="url" />}
						</form.AppField>
						<form.AppField name="followUpAt">
							{(field) => <field.TextField label="Follow-up date" type="date" />}
						</form.AppField>
						<form.AppField name="jobPostText">
							{(field) => <field.TextareaField label="Job post" />}
						</form.AppField>
						<form.AppField name="notes">
							{(field) => <field.TextareaField label="Notes" />}
						</form.AppField>
					</FieldGroup>
				</CardContent>
				<CardFooter className="mt-6">
					<form.AppForm>
						<form.SubmitButton label={submitLabel} />
					</form.AppForm>
				</CardFooter>
			</form>
		</Card>
	);
}
