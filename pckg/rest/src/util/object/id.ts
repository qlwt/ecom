export const object_id = function(src: string | { readonly id: string }): string {
    if (typeof src === "string") {
        return src
    }

    return src.id
}
