import { Button } from "#/components/ui/button";
import { Spinner } from "#/components/ui/spinner";
import { useFormContext } from "#/hooks/form-context";

export function SubmitButton({ label }: { label: string }) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting && <Spinner />}
					{label}
				</Button>
			)}
		</form.Subscribe>
	);
}
