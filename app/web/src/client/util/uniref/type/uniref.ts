export type UniRef<T> = (
    | {
        current: T
    }
    | {
        (current: T): void
    }
)
