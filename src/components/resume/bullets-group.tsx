import { withFieldGroup } from "#/hooks/form";
import type { Resume } from "#/lib/resume-schemas";

import { newBullet } from "./empty-resume";
import { AddButton, ItemControls } from "./section";

type Bullet = Resume["experience"][number]["bullets"][number];

// Experience, projects and custom sections all share this bullet list.
export const BulletsGroup = withFieldGroup({
	defaultValues: { bullets: [] as Bullet[] },
	render: function Render({ group }) {
		return (
			<group.AppField name="bullets" mode="array">
				{(field) => {
					// Removing a parent entry re-renders this list once before it unmounts,
					// and by then its path points at nothing.
					const bullets = field.state.value ?? [];

					return (
						<div className="flex flex-col gap-3">
							{bullets.map((bullet, i) => (
								<div key={bullet.id} className="flex items-start gap-2">
									<div className="flex-1">
										<group.AppField name={`bullets[${i}].text`}>
											{(textField) => <textField.TextareaField label={`Bullet ${i + 1}`} />}
										</group.AppField>
									</div>
									<ItemControls
										label={`bullet ${i + 1}`}
										index={i}
										count={bullets.length}
										onMove={field.moveValue}
										onRemove={field.removeValue}
									/>
								</div>
							))}
							<AddButton label="Add bullet" onClick={() => field.pushValue(newBullet())} />
						</div>
					);
				}}
			</group.AppField>
		);
	},
});
