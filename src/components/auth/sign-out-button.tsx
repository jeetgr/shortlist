import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";

export function SignOutButton() {
	const router = useRouter();
	const queryClient = useQueryClient();

	async function handleSignOut() {
		await authClient.signOut();
		queryClient.clear();
		await router.invalidate();
		await router.navigate({ to: "/sign-in" });
	}

	return (
		<Button variant="outline" onClick={handleSignOut}>
			Sign out
		</Button>
	);
}
