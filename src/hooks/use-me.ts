import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "#/orpc/client.ts";

export const useMe = () => useSuspenseQuery(orpc.user.me.queryOptions()).data;
