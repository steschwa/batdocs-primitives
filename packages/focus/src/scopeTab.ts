import { getAllFocusable } from "./getAllFocusable"

export function scopeTab(inside: HTMLElement, event: KeyboardEvent) {
    const focusableChildren = getAllFocusable(inside)
    if (focusableChildren.length === 0) {
        event.preventDefault()
        return
    }

    const finalFocusable = focusableChildren[event.shiftKey ? 0 : focusableChildren.length - 1]
    const leavingFinalFocusable =
        finalFocusable === document.activeElement || document.activeElement === inside

    if (!leavingFinalFocusable) {
        return
    }

    event.preventDefault()

    const target = focusableChildren[event.shiftKey ? focusableChildren.length - 1 : 0]
    if (target) {
        target.focus()
    }
}
