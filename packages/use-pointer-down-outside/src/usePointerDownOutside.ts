import { useCallbackRef } from "@batdocs/use-callback-ref"
import * as React from "react"

export type UsePointerDownReturn<T extends HTMLElement> = React.Ref<T>

export function usePointerDownOutside<T extends HTMLElement = HTMLElement>(
    enabled: boolean,
    callback: UsePointerDownCallback,
): UsePointerDownReturn<T> {
    const ref = React.useRef<T>(null)

    const callbackRef = useCallbackRef(callback)

    React.useEffect(() => {
        if (!enabled) {
            return
        }

        const handler = (event: PointerEvent) => {
            if (!ref.current) {
                return
            }

            if (!ref.current.contains(event.target as HTMLElement)) {
                callbackRef()
            }
        }

        document.addEventListener("pointerdown", handler)
        return () => {
            document.removeEventListener("pointerdown", handler)
        }
    }, [enabled, callbackRef])

    return ref
}

export type UsePointerDownCallback = () => void
