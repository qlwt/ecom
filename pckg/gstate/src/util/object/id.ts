export const object_id = function (src: string | { readonly id: string }): string {
    if (typeof src === "object") {
        return src.id
    }

    return src
}
