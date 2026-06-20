import { restx_ping_route_new_push } from "@src/restx/ping/route/new/push";
import type { Cluster } from "@src/util/cluster/type/cluster";

export const restx_ping = {
    routes: {
        push: restx_ping_route_new_push({}),
    } as const
} satisfies Cluster
