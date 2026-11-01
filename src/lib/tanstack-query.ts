import { QueryClient } from "@tanstack/react-query";

// Call once per router. The server builds a router per request, so users never share a cache.
export function createQueryClient() {
	return new QueryClient();
}
