import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// The server doesn't know the viewer's time zone, so it renders UTC and the browser swaps in local time.
export function LocalDateTime({ date }: { date: Date }) {
	const text = useSyncExternalStore(
		subscribe,
		() => date.toLocaleString("en", { dateStyle: "medium", timeStyle: "short" }),
		() => date.toLocaleString("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }),
	);

	return <time dateTime={date.toISOString()}>{text}</time>;
}
