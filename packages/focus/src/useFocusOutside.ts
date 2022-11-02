import { useState } from "react"

export type UseFocusOutsideParams<T extends HTMLElement> = {
    onBlurOutside: (event: React.FocusEvent<T>) => void
}

export type UseFocusOutsideReturn<T extends HTMLElement> = {
    ref: React.RefCallback<T>
    onBlur: React.DOMAttributes<T>["onBlur"]
}

export function useFocusOutside<T extends HTMLElement>(
    params: UseFocusOutsideParams<T>,
): UseFocusOutsideReturn<T> {
    const { onBlurOutside } = params

    const [ref, setRef] = useState<T | null>(null)

    const handleBlur = (event: React.FocusEvent<T>) => {
        if (!ref) {
            return
        }

        if (getIsFocusedOutside(ref, event)) {
            onBlurOutside(event)
        }
    }

    return {
        ref: setRef,
        onBlur: handleBlur,
    }
}

function getIsFocusedOutside(outsideOf: HTMLElement, event: React.FocusEvent): boolean {
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
