import { useState } from "react"
import { getAllFocusable } from "./getAllFocusable"

export type UseTrapFocusReturn<T extends HTMLElement> = {
    ref: React.RefCallback<T>
    onKeyDown: React.DOMAttributes<T>["onKeyDown"]
}

export function useTrapFocus<T extends HTMLElement>(): UseTrapFocusReturn<T> {
    const [ref, setRef] = useState<T | null>(null)

    const handleKeyDown = (event: React.KeyboardEvent<T>) => {
        if (!ref) {
            return
        }
        if (event.code === "Tab") {
            scopeTab(ref, event)
        }
    }

    return {
        ref: setRef,
        onKeyDown: handleKeyDown,
    }
}

function scopeTab(inside: HTMLElement, event: React.KeyboardEvent) {
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
