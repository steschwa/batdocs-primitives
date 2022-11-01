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
