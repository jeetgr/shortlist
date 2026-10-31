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
import { signInSchema } from "#/lib/auth-schemas";

export function SignInForm() {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useAppForm({
		defaultValues: { email: "", password: "" },
		validators: { onSubmit: signInSchema },
		onSubmit: async ({ value }) => {
			setServerError(null);
			const { error } = await authClient.signIn.email(value);
			if (error) {
				setServerError(error.message ?? "Could not sign in. Try again.");
				return;
			}
			await router.invalidate();
			await router.navigate({ to: "/" });
		},
	});

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Sign in</CardTitle>
				<CardDescription>Welcome back to Shortlist.</CardDescription>
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
						<form.AppField name="email">
							{(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
						</form.AppField>
						<form.AppField name="password">
							{(field) => (
								<field.TextField label="Password" type="password" autoComplete="current-password" />
							)}
						</form.AppField>
					</FieldGroup>
				</CardContent>
				<CardFooter className="mt-6 flex-col gap-4">
					<form.AppForm>
						<form.SubmitButton label="Sign in" />
					</form.AppForm>
					<p className="text-muted-foreground text-sm">
						New here?{" "}
						<Link to="/sign-up" className="underline underline-offset-4">
							Create an account
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
