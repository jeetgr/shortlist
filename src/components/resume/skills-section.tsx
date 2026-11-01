import { withForm } from "#/hooks/form";

import { createEmptyResume, newSkillGroup } from "./empty-resume";
import { ItemControls, Section } from "./section";

export const SkillsSection = withForm({
	defaultValues: createEmptyResume(),
	render: function Render({ form }) {
		return (
			<form.AppField name="skills" mode="array">
				{(field) => (
					<Section
						title="Skills"
						addLabel="Add skill group"
						onAdd={() => field.pushValue(newSkillGroup())}
					>
						{field.state.value.map((group, i) => (
							<div key={group.id} className="flex items-start gap-2">
								<div className="grid flex-1 gap-4 sm:grid-cols-[1fr_2fr]">
									<form.AppField name={`skills[${i}].category`}>
										{(f) => <f.TextField label="Category" />}
									</form.AppField>
									<form.AppField name={`skills[${i}].items`}>
										{(f) => <f.SkillsField label="Skills, separated by commas" />}
									</form.AppField>
								</div>
								<ItemControls
									label={`skill group ${i + 1}`}
									index={i}
									count={field.state.value.length}
									onMove={field.moveValue}
									onRemove={field.removeValue}
								/>
							</div>
						))}
					</Section>
				)}
			</form.AppField>
		);
	},
});
