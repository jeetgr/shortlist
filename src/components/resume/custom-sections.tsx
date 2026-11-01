import { withForm } from "#/hooks/form";

import { BulletsGroup } from "./bullets-group";
import { createEmptyResume, newCustomSection } from "./empty-resume";
import { ItemControls, Section } from "./section";

export const CustomSections = withForm({
	defaultValues: createEmptyResume(),
	render: function Render({ form }) {
		return (
			<form.AppField name="customSections" mode="array">
				{(field) => (
					<Section
						title="Other sections"
						addLabel="Add section"
						onAdd={() => field.pushValue(newCustomSection())}
					>
						{field.state.value.map((section, i) => (
							<div key={section.id} className="flex flex-col gap-4 rounded-2xl border p-4">
								<div className="flex justify-end">
									<ItemControls
										label={`section ${i + 1}`}
										index={i}
										count={field.state.value.length}
										onMove={field.moveValue}
										onRemove={field.removeValue}
									/>
								</div>
								<form.AppField name={`customSections[${i}].title`}>
									{(f) => <f.TextField label="Section title" />}
								</form.AppField>
								<BulletsGroup
									// A field group keeps its path from mount, so it must remount when the index changes.
									key={i}
									form={form}
									fields={`customSections[${i}]`}
								/>
							</div>
						))}
					</Section>
				)}
			</form.AppField>
		);
	},
});
