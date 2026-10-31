import { useRouter } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";

export function SignOutButton() {
	const router = useRouter();

	async function handleSignOut() {
		await authClient.signOut();
		await router.invalidate();
		await router.navigate({ to: "/sign-in" });
	}

	return (
		<Button variant="outline" onClick={handleSignOut}>
			Sign out
		</Button>
	);
}
