import { useState } from "react";

import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { useFieldContext } from "#/hooks/form-context";

function parseSkills(text: string) {
	return text
		.split(",")
		.map((skill) => skill.trim())
		.filter(Boolean);
}

export function SkillsField({ label }: { label: string }) {
	const field = useFieldContext<string[]>();
	// The raw text keeps a trailing comma or space while the person is typing.
	const [text, setText] = useState(() => field.state.value.join(", "));
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<Input
				id={field.name}
				name={field.name}
				placeholder="React, TypeScript, Node.js"
				value={text}
				onBlur={field.handleBlur}
				onChange={(event) => {
					setText(event.target.value);
					field.handleChange(parseSkills(event.target.value));
				}}
				aria-invalid={isInvalid}
			/>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
