export function delayFocus(element: HTMLElement | null, focusOptions?: FocusOptions) {
    setTimeout(() => {
        element?.focus(focusOptions)
    })
}
