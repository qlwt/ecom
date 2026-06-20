import * as capi from "@fst/capi";
import { remx_auth__act_delete } from "@src/remx/auth/internal/act/delete";
import { remx_auth__act_match_email_patch } from "@src/remx/auth/internal/act/match_email_patch";
import { remx_auth__act_match_email_post } from "@src/remx/auth/internal/act/match_email_post";
import { remx_auth__act_signcheck_fallback } from "@src/remx/auth/internal/act/signcheck_fallback";
import { remx_auth__act_signcheck_strict } from "@src/remx/auth/internal/act/signcheck_strict";
import { remx_auth__act_signin_email } from "@src/remx/auth/internal/act/signin_email";
import { remx_auth__act_signout } from "@src/remx/auth/internal/act/signout";
import { remx_auth__act_signup_email } from "@src/remx/auth/internal/act/signup_email";
import { remx_auth__joins_core } from "@src/remx/auth/internal/joins/core";
import { remx_auth__loader_check } from "@src/remx/auth/internal/loader/check";
import { remx_auth__state } from "@src/remx/auth/internal/state";

export const remx_auth = {
    state: remx_auth__state,

    act: {
        delete: (rparams: capi.SendRestX_AuthDelete_Params) => {
            return remx_auth__act_delete({
                rparams,
            })
        },

        match_email_patch: (rparams: capi.SendRestX_AuthMatchEmailPatch_Params) => {
            return remx_auth__act_match_email_patch({
                rparams,
            })
        },

        match_email_post: (rparams: capi.SendRestX_AuthMatchEmailPost_Params) => {
            return remx_auth__act_match_email_post({
                rparams,
            })
        },

        signout: (rparams: capi.SendRestX_AuthSignOut_Params) => {
            return remx_auth__act_signout({
                rparams,
            })
        },

        signin_email: (rparams: capi.SendRestX_AuthSignInEmail_Params) => {
            return remx_auth__act_signin_email({
                rparams,
            })
        },

        signup_email: (rparams: capi.SendRestX_AuthSignUpEmail_Params) => {
            return remx_auth__act_signup_email({
                rparams,
            })
        },

        signcheck_strict: (rparams: capi.SendRestX_AuthSignCheckStrict_Params) => {
            return remx_auth__act_signcheck_strict({
                rparams,
            })
        },

        signcheck_fallback: (rparams: capi.SendRestX_AuthSignCheckFallback_Params) => {
            return remx_auth__act_signcheck_fallback({
                rparams,
            })
        },
    } as const,

    loaders: {
        check: remx_auth__loader_check,
    },

    joins: {
        core: remx_auth__joins_core(),
    },
} as const
