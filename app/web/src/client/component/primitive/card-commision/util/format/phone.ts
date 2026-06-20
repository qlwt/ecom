export const epcardcommision__format_phone = function(value_raw: string) {
    const value = value_raw.replace(/\D+/g, "")

    if (value.length === 0) {
        return ""
    }

    const part_op = value_raw.slice(0, 3)
    const part_num1 = value_raw.slice(3, 6)
    const part_num2 = value_raw.slice(6, 8)
    const part_num3 = value_raw.slice(8, 10)
    const part_rest = value_raw.slice(10)

    let result = ""

    if (part_op.length < 3) {
        result += `(${part_op}`
    } else {
        result += `(${part_op})`
    }

    if (part_num1) {
        result += ` ${part_num1}`
    } else {
        return result
    }

    if (part_num2) {
        result += ` ${part_num2}`
    } else {
        return result
    }

    if (part_num3) {
        result += ` ${part_num3}`
    } else {
        return result
    }

    if (part_rest) {
        result += ` ${part_rest}`
    }

    return result
}
