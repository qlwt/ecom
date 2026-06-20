import type { FType } from "@src/client"

export type RestDefImg_PostStd = {
    readonly kind: "std"

    readonly files: {
        [K in string]: FType
    }
}

// export type RestDefImg_PostNone = {
//     readonly kind: "none"
// }

export type RestDefImg_Post = (
    // | RestDefImg_PostNone
    | RestDefImg_PostStd
)

export type RestDefImg_GetStd = {
    readonly kind: "std"

    readonly query: {
        [K in string]: FType
    }
}

// export type RestDefImg_GetNone = {
//     readonly kind: "none"
// }

export type RestDefImg_Get = (
    // | RestDefImg_GetNone
    | RestDefImg_GetStd
)

export type RestDefImg_DeleteStd = {
    readonly kind: "std"
}

// export type RestDefImg_DeleteNone = {
//     readonly kind: "none"
// }

export type RestDefImg_Delete = (
    // | RestDefImg_DeleteNone
    | RestDefImg_DeleteStd
)

export type RestDefImg = {
    post: RestDefImg_Post
    get: RestDefImg_Get
    delete: RestDefImg_Delete
}
