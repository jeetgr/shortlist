import { useState } from "react";

import { Button } from "#/components/ui/button";
import { FieldError } from "#/components/ui/field";
import { Spinner } from "#/components/ui/spinner";
import { authClient } from "#/lib/auth-client";

export function GoogleButton() {
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleClick() {
		setError(null);
		setIsPending(true);
		const { error } = await authClient.signIn.social({
			provider: "google",
			callbackURL: "/",
		});
		// On success the browser leaves for Google, so only failures need handling.
		if (error) {
			setError(error.message ?? "Could not continue with Google. Try again.");
			setIsPending(false);
		}
	}

	return (
		<div className="flex w-full flex-col gap-2">
			<Button
				type="button"
				variant="outline"
				className="w-full"
				disabled={isPending}
				onClick={handleClick}
			>
				{isPending && <Spinner />}
				Continue with Google
			</Button>
			{error && <FieldError>{error}</FieldError>}
		</div>
	);
}
