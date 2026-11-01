import { Link } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";

export function ApplicationNotFound() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 p-4">
			<p>This application doesn't exist.</p>
			<Button nativeButton={false} render={<Link to="/applications" />}>
				Back to applications
			</Button>
		</div>
	);
}
