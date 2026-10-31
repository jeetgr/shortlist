import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { Alert, AlertDescription } from "#/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { FieldGroup } from "#/components/ui/field";
import { useAppForm } from "#/hooks/form";
import { authClient } from "#/lib/auth-client";
import { signUpSchema } from "#/lib/auth-schemas";

export function SignUpForm() {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useAppForm({
		defaultValues: { name: "", email: "", password: "" },
		validators: { onSubmit: signUpSchema },
		onSubmit: async ({ value }) => {
			setServerError(null);
			const { error } = await authClient.signUp.email(value);
			if (error) {
				setServerError(error.message ?? "Could not create your account. Try again.");
				return;
			}
			await router.invalidate();
			await router.navigate({ to: "/" });
		},
	});

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Create your account</CardTitle>
				<CardDescription>Start tracking your applications.</CardDescription>
			</CardHeader>
			<form
				noValidate
				onSubmit={(event) => {
					event.preventDefault();
					form.handleSubmit();
				}}
			>
				<CardContent>
					<FieldGroup>
						{serverError && (
							<Alert variant="destructive">
								<AlertDescription>{serverError}</AlertDescription>
							</Alert>
						)}
						<form.AppField name="name">
							{(field) => <field.TextField label="Name" autoComplete="name" />}
						</form.AppField>
						<form.AppField name="email">
							{(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
						</form.AppField>
						<form.AppField name="password">
							{(field) => (
								<field.TextField label="Password" type="password" autoComplete="new-password" />
							)}
						</form.AppField>
					</FieldGroup>
				</CardContent>
				<CardFooter className="mt-6 flex-col gap-4">
					<form.AppForm>
						<form.SubmitButton label="Create account" />
					</form.AppForm>
					<p className="text-muted-foreground text-sm">
						Already have an account?{" "}
						<Link to="/sign-in" className="underline underline-offset-4">
							Sign in
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
