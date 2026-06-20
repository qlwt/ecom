import type { FType } from "@src/client"

export type RestDefData_PostStd = {
    readonly kind: "std"
}

// export type RestDefData_PostNone = {
//     readonly kind: "none"
// }

export type RestDefData_Post = (
    // | RestDefData_PostNone
    | RestDefData_PostStd
)

export type RestDefData_GetStd = {
    readonly kind: "std"

    readonly query: {
        [K in string]: FType
    }
}

// export type RestDefData_GetNone = {
//     readonly kind: "none"
// }

export type RestDefData_Get = (
    // | RestDefData_GetNone
    | RestDefData_GetStd
)

export type RestDefData_PatchStd = {
    readonly kind: "std"
}

// export type RestDefData_PatchNone = {
//     readonly kind: "none"
// }

export type RestDefData_Patch = (
    // | RestDefData_PatchNone
    | RestDefData_PatchStd
)

export type RestDefData_DeleteStd = {
    readonly kind: "std"
}

// export type RestDefData_DeleteNone = {
//     readonly kind: "none"
// }

export type RestDefData_Delete = (
    // | RestDefData_DeleteNone
    | RestDefData_DeleteStd
)

export type RestDefData = {
    post: RestDefData_Post
    patch: RestDefData_Patch
    delete: RestDefData_Delete
    get: RestDefData_Get
}
