import { restx_auth_route_new_delete } from "@src/restx/auth/route/new/delete";
import { restx_auth_route_new_method_email_patch } from "@src/restx/auth/route/new/method_email_patch";
import { restx_auth_route_new_method_email_post } from "@src/restx/auth/route/new/method_email_post";
import { restx_auth_route_new_signcheck_fallback } from "@src/restx/auth/route/new/signcheck_fallback";
import { restx_auth_route_new_signcheck_strict } from "@src/restx/auth/route/new/signcheck_strict";
import { restx_auth_route_new_signin_email } from "@src/restx/auth/route/new/signin_email";
import { restx_auth_route_new_signout } from "@src/restx/auth/route/new/signout";
import { restx_auth_route_new_signup_email } from "@src/restx/auth/route/new/signup_email";
import type { Cluster } from "@src/util/cluster/type/cluster";

export const restx_auth = {
    routes: {
        delete: restx_auth_route_new_delete({}),
        signout: restx_auth_route_new_signout({}),
        signcheck_strict: restx_auth_route_new_signcheck_strict({}),
        signcheck_fallback: restx_auth_route_new_signcheck_fallback({}),
        signin_email: restx_auth_route_new_signin_email({}),
        signup_email: restx_auth_route_new_signup_email({}),
        match_email_post: restx_auth_route_new_method_email_post({}),
        match_email_patch: restx_auth_route_new_method_email_patch({}),
    } as const
} satisfies Cluster
