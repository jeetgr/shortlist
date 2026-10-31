import { createFileRoute } from "@tanstack/react-router";

import { SignUpForm } from "#/components/auth/sign-up-form";

export const Route = createFileRoute("/(auth)/sign-up")({ component: SignUpPage });

function SignUpPage() {
	return (
		<main className="flex min-h-svh items-center justify-center p-4">
			<SignUpForm />
		</main>
	);
}
