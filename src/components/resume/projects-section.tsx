import { withForm } from "#/hooks/form";

import { BulletsGroup } from "./bullets-group";
import { createEmptyResume, newProject } from "./empty-resume";
import { ItemControls, Section } from "./section";

export const ProjectsSection = withForm({
	defaultValues: createEmptyResume(),
	render: function Render({ form }) {
		return (
			<form.AppField name="projects" mode="array">
				{(field) => (
					<Section
						title="Projects"
						addLabel="Add project"
						onAdd={() => field.pushValue(newProject())}
					>
						{field.state.value.map((project, i) => (
							<div key={project.id} className="flex flex-col gap-4 rounded-2xl border p-4">
								<div className="flex justify-end">
									<ItemControls
										label={`project ${i + 1}`}
										index={i}
										count={field.state.value.length}
										onMove={field.moveValue}
										onRemove={field.removeValue}
									/>
								</div>
								<form.AppField name={`projects[${i}].name`}>
									{(f) => <f.TextField label="Project name" />}
								</form.AppField>
								<div className="grid gap-4 sm:grid-cols-2">
									<form.AppField name={`projects[${i}].url`}>
										{(f) => <f.TextField label="Live URL" type="url" />}
									</form.AppField>
									<form.AppField name={`projects[${i}].repoUrl`}>
										{(f) => <f.TextField label="Repo URL" type="url" />}
									</form.AppField>
								</div>
								<BulletsGroup
									// A field group keeps its path from mount, so it must remount when the index changes.
									key={i}
									form={form}
									fields={`projects[${i}]`}
								/>
							</div>
						))}
					</Section>
				)}
			</form.AppField>
		);
	},
});
