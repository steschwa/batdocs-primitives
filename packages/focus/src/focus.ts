export function getFirstFocusable<T extends HTMLElement>(candidates: Array<T | null>): T | null {
    const previouslyFocusedElement = document.activeElement

    const focusableCandidates = candidates.filter(Boolean) as T[]

    for (const candidate of focusableCandidates) {
        if (candidate === previouslyFocusedElement) {
            return null
        }

        candidate.focus()
        if (previouslyFocusedElement !== document.activeElement) {
            return candidate
        }
    }

    return null
}

const focusableElements = [
    "a[href]",
    "area[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "button:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]:not([contenteditable="false"])',
]
export function getAllFocusable(anchorElement: HTMLElement | null): HTMLElement[] {
    if (!anchorElement) {
        return []
    }

    return Array.from(anchorElement.querySelectorAll(focusableElements.join(","))) as HTMLElement[]
}

export function saveFocus(element: HTMLElement | null, focusOptions?: FocusOptions) {
    setTimeout(() => {
        element?.focus(focusOptions)
    })
}
