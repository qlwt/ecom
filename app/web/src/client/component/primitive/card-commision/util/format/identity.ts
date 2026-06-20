export const epcardcommision__format_identity = function(value_raw: string) {
    return value_raw.replace(/(\d\d\d\d)(?!$)/g, "$1-")
}
