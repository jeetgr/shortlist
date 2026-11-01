import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { useFieldContext } from "#/hooks/form-context";

// A required month stays "" when cleared, so the schema can show its error.
// An optional month becomes undefined, because the schema would reject "".
export function MonthField({ label, optional = false }: { label: string; optional?: boolean }) {
	const field = useFieldContext<string | undefined>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<Input
				id={field.name}
				name={field.name}
				type="month"
				value={field.state.value ?? ""}
				onBlur={field.handleBlur}
				onChange={(event) => {
					const { value } = event.target;
					field.handleChange(value === "" && optional ? undefined : value);
				}}
				aria-invalid={isInvalid}
			/>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
