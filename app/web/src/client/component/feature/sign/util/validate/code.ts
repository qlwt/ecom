export const efsign__validate_code = (value: string) => {
    value = value.trim()

    return value.length === 6 && /^\d+$/.test(value)
}
