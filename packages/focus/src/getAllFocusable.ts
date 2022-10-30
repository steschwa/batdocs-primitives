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
