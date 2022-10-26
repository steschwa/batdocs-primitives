import { useCallbackRef } from "@batdocs/use-callback-ref"
import * as React from "react"

export type UseFocusWithinParams = {
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
}

type UseFocusWithinReturn<T extends HTMLElement> = {
    ref: React.RefCallback<T>
    focusWithin: boolean
}

export function useFocusWithin<T extends HTMLElement>(
    params?: UseFocusWithinParams,
): UseFocusWithinReturn<T> {
    const [focusWithin, setFocusWithin] = React.useState(false)
    const isFocusWithin = React.useRef(false)
    const unsubscribe = React.useRef<UnsubscribeEventHandlersFn>()

    const onFocus = useCallbackRef(params?.onFocus)
    const onBlur = useCallbackRef(params?.onBlur)

    const ref: React.RefCallback<T> = React.useCallback(
        element => {
            if (!element) {
                return
            }

            unsubscribe.current?.()

            const setFocus = (focused: boolean) => {
                setFocusWithin(focused)
                isFocusWithin.current = focused
            }

            const focusInHandler = (event: FocusEvent) => {
                if (!isFocusWithin.current) {
                    setFocus(true)
                    onFocus(event)
                }
            }
            const focusOutHandler = (event: FocusEvent) => {
                if (isFocusWithin.current && !getIsChildrenFocused(event)) {
                    setFocus(false)
                    onBlur(event)
                }
            }

            element.addEventListener("focusin", focusInHandler)
            element.addEventListener("focusout", focusOutHandler)

            unsubscribe.current = () => {
                element.removeEventListener("focusin", focusInHandler)
                element.removeEventListener("focusout", focusOutHandler)
            }
        },
        [onFocus, onBlur],
    )

    React.useEffect(() => {
        const unsubscribeFn = unsubscribe.current
        return () => {
            unsubscribeFn?.()
        }
    }, [])

    return {
        ref,
        focusWithin,
    }
}

type UnsubscribeEventHandlersFn = () => void

function getIsChildrenFocused(event: FocusEvent): boolean {
    if (event.currentTarget instanceof HTMLElement && event.relatedTarget instanceof HTMLElement) {
        return event.currentTarget.contains(event.relatedTarget)
    }

    return false
}
