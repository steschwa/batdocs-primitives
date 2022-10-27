import * as React from "react"
import { getAllFocusable, saveFocus } from "./focus"

export type UseFocusTrapOptions = {
    /**
     * Initially focus the first focusable element
     * @default false
     */
    autoFocus?: boolean
    /**
     * Restore focus to trigger on unmount
     * @default false
     */
    restoreFocus?: boolean
}

export function useFocusTrap<T extends HTMLElement>(
    options: UseFocusTrapOptions = {},
): React.RefCallback<T | null> {
    const { autoFocus = false, restoreFocus = false } = options

    const ref = React.useRef<T | null>(null)
    const refCleanupFns = React.useRef<CleanupFn[]>([])
    const restoreFocusTo = React.useRef<HTMLElement | null>(null)

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Tab" && ref.current) {
                trapFocusChange(ref.current, event)
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            refCleanupFns.current.forEach(cleanupFn => cleanupFn())
        }
    }, [])

    const setRef: React.RefCallback<T | null> = React.useCallback(
        element => {
            ref.current = element
            restoreFocusTo.current = null
            if (!element) {
                return
            }

            const cleanup: CleanupFn[] = []

            if (restoreFocus) {
                cleanup.push(
                    attachEventListener(element, "focus", (event: FocusEvent) => {
                        restoreFocusTo.current = event.relatedTarget as HTMLElement | null
                    }),
                    attachEventListener(element, "focusout", (event: FocusEvent) => {
                        if (!restoreFocusTo.current) {
                            return
                        }

                        if (element.contains(event.relatedTarget as HTMLElement)) {
                            return
                        }

                        saveFocus(restoreFocusTo.current)
                        restoreFocusTo.current = null
                    }),
                )
            }

            if (autoFocus) {
                cleanup.push(
                    attachEventListener(element, "focus", () => {
                        const focusable = getAllFocusable(element)
                        if (focusable.length > 0) {
                            saveFocus(focusable[0])
                        }
                    }),
                )
            }

            refCleanupFns.current = cleanup
        },
        [autoFocus, restoreFocus],
    )

    return setRef
}

type CleanupFn = () => void

function trapFocusChange(anchorElement: HTMLElement, event: KeyboardEvent): void {
    const focusable = getAllFocusable(anchorElement)
    if (focusable.length === 0) {
        event.preventDefault()
        return
    }

    const finalFocusable = focusable[event.shiftKey ? 0 : focusable.length - 1]
    const isLeavingFinalFocusable =
        finalFocusable === document.activeElement || anchorElement === document.activeElement

    if (!isLeavingFinalFocusable) {
        return
    }

    event.preventDefault()

    const target = focusable[event.shiftKey ? focusable.length - 1 : 0]
    if (target) {
        target.focus()
    }
}

function attachEventListener<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    listener: (event: HTMLElementEventMap[K]) => void,
): CleanupFn {
    element.addEventListener(type, listener)

    return () => {
        element.removeEventListener(type, listener)
    }
}
