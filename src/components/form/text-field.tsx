import type { ComponentProps } from "react";

import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { useFieldContext } from "#/hooks/form-context";

type TextFieldProps = {
	label: string;
	type?: ComponentProps<"input">["type"];
	autoComplete?: ComponentProps<"input">["autoComplete"];
};

export function TextField({ label, type = "text", autoComplete }: TextFieldProps) {
	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<Input
				id={field.name}
				name={field.name}
				type={type}
				autoComplete={autoComplete}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(event) => field.handleChange(event.target.value)}
				aria-invalid={isInvalid}
			/>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
