export function produceToggleValue(values: string[], value: string): string[] {
    if (values.includes(value)) {
        return values.filter(checkedValue => {
            return checkedValue !== value
        })
    } else {
        return [...values, value]
    }
}
