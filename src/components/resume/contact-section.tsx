import { FieldGroup } from "#/components/ui/field";
import { withForm } from "#/hooks/form";

import { createEmptyResume } from "./empty-resume";
import { Section } from "./section";

export const ContactSection = withForm({
	defaultValues: createEmptyResume(),
	render: function Render({ form }) {
		return (
			<Section title="Contact">
				<FieldGroup className="grid gap-4 sm:grid-cols-2">
					<form.AppField name="contact.name">
						{(field) => <field.TextField label="Name" autoComplete="name" />}
					</form.AppField>
					<form.AppField name="contact.title">
						{(field) => <field.TextField label="Title" />}
					</form.AppField>
					<form.AppField name="contact.email">
						{(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
					</form.AppField>
					<form.AppField name="contact.phone">
						{(field) => <field.TextField label="Phone" type="tel" autoComplete="tel" />}
					</form.AppField>
					<form.AppField name="contact.location">
						{(field) => <field.TextField label="Location" />}
					</form.AppField>
					<form.AppField name="contact.linkedin">
						{(field) => <field.TextField label="LinkedIn URL" type="url" />}
					</form.AppField>
					<form.AppField name="contact.github">
						{(field) => <field.TextField label="GitHub URL" type="url" />}
					</form.AppField>
					<form.AppField name="contact.website">
						{(field) => <field.TextField label="Website URL" type="url" />}
					</form.AppField>
				</FieldGroup>
				<form.AppField name="summary">
					{(field) => <field.TextareaField label="Summary" />}
				</form.AppField>
			</Section>
		);
	},
});
