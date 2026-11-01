import { withForm } from "#/hooks/form";

import { createEmptyResume, newEducation } from "./empty-resume";
import { ItemControls, Section } from "./section";

export const EducationSection = withForm({
	defaultValues: createEmptyResume(),
	render: function Render({ form }) {
		return (
			<form.AppField name="education" mode="array">
				{(field) => (
					<Section
						title="Education"
						addLabel="Add education"
						onAdd={() => field.pushValue(newEducation())}
					>
						{field.state.value.map((entry, i) => (
							<div key={entry.id} className="flex flex-col gap-4 rounded-2xl border p-4">
								<div className="flex justify-end">
									<ItemControls
										label={`education ${i + 1}`}
										index={i}
										count={field.state.value.length}
										onMove={field.moveValue}
										onRemove={field.removeValue}
									/>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<form.AppField name={`education[${i}].degree`}>
										{(f) => <f.TextField label="Degree" />}
									</form.AppField>
									<form.AppField name={`education[${i}].institution`}>
										{(f) => <f.TextField label="Institution" />}
									</form.AppField>
									<form.AppField name={`education[${i}].startDate`}>
										{(f) => <f.MonthField label="Start date (optional)" optional />}
									</form.AppField>
									<form.AppField name={`education[${i}].endDate`}>
										{(f) => <f.MonthField label="End or expected date" />}
									</form.AppField>
								</div>
							</div>
						))}
					</Section>
				)}
			</form.AppField>
		);
	},
});
