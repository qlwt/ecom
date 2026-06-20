import { restx_delivery_route_new_city_get } from "@src/restx/delivery/route/new/city_get";
import { restx_delivery_route_new_parent_get } from "@src/restx/delivery/route/new/parent_get";
import type { Cluster } from "@src/util/cluster/type/cluster";

export const restx_delivery = {
    routes: {
        city_get: restx_delivery_route_new_city_get({}),
        parent_get: restx_delivery_route_new_parent_get({}),
    } as const
} satisfies Cluster
