export type Join = {
    readonly kind: "forwards" | "backwards"
    readonly variant: string
    readonly self_field: string
    readonly target_table: string
    readonly target_field: string
    readonly status_optional: boolean
}
