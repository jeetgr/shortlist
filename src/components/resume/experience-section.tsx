import { withForm } from "#/hooks/form";

import { BulletsGroup } from "./bullets-group";
import { createEmptyResume, newExperience } from "./empty-resume";
import { ItemControls, Section } from "./section";

export const ExperienceSection = withForm({
	defaultValues: createEmptyResume(),
	render: function Render({ form }) {
		return (
			<form.AppField name="experience" mode="array">
				{(field) => (
					<Section
						title="Experience"
						addLabel="Add experience"
						onAdd={() => field.pushValue(newExperience())}
					>
						{field.state.value.map((entry, i) => (
							<div key={entry.id} className="flex flex-col gap-4 rounded-2xl border p-4">
								<div className="flex justify-end">
									<ItemControls
										label={`experience ${i + 1}`}
										index={i}
										count={field.state.value.length}
										onMove={field.moveValue}
										onRemove={field.removeValue}
									/>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<form.AppField name={`experience[${i}].title`}>
										{(f) => <f.TextField label="Job title" />}
									</form.AppField>
									<form.AppField name={`experience[${i}].company`}>
										{(f) => <f.TextField label="Company" />}
									</form.AppField>
									<form.AppField name={`experience[${i}].location`}>
										{(f) => <f.TextField label="Location" />}
									</form.AppField>
									<form.AppField name={`experience[${i}].startDate`}>
										{(f) => <f.MonthField label="Start date" />}
									</form.AppField>
									<form.AppField name={`experience[${i}].endDate`}>
										{(f) => <f.EndDateField />}
									</form.AppField>
								</div>
								<BulletsGroup
									// A field group keeps its path from mount, so it must remount when the index changes.
									key={i}
									form={form}
									fields={`experience[${i}]`}
								/>
							</div>
						))}
					</Section>
				)}
			</form.AppField>
		);
	},
});
