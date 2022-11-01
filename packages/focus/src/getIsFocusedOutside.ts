export function getIsFocusedOutside(outsideOf: HTMLElement, event: FocusEvent): boolean {
    if (event.relatedTarget === null) {
        return true
    }
    if (!(event.relatedTarget instanceof HTMLElement)) {
        return false
    }

    if (!outsideOf.contains(event.relatedTarget)) {
        return true
    }

    return false
}
