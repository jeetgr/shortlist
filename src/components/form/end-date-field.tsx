import { Checkbox } from "#/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { useFieldContext } from "#/hooks/form-context";

// null means the person still works here.
export function EndDateField() {
	const field = useFieldContext<string | null>();
	const isCurrent = field.state.value === null;
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>End date</FieldLabel>
			<Input
				id={field.name}
				name={field.name}
				type="month"
				disabled={isCurrent}
				value={field.state.value ?? ""}
				onBlur={field.handleBlur}
				onChange={(event) => field.handleChange(event.target.value)}
				aria-invalid={isInvalid}
			/>
			<FieldLabel className="font-normal">
				<Checkbox
					checked={isCurrent}
					onCheckedChange={(checked) => field.handleChange(checked ? null : "")}
				/>
				I currently work here
			</FieldLabel>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
