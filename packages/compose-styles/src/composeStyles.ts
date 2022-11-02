export function composeStyles(
    ...styles: Array<React.CSSProperties | null | undefined>
): React.CSSProperties | undefined {
    const definedStyles = styles.filter(Boolean) as React.CSSProperties[]
    if (definedStyles.length === 0) {
        return undefined
    }

    return definedStyles.reduce(
        (acc, cur) => ({
            ...acc,
            ...cur,
        }),
        {},
    )
}
