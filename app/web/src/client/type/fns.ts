export type FnSetterStateles<T> = {
    (setter_value: T): void
}

export type FnSetterStateful<T> = {
    (setter_value: T | ((old_setter_value: T) => T)): void
}
