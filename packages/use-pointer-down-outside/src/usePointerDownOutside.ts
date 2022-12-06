import { useCallbackRef } from "@batdocs/use-callback-ref"
import * as React from "react"

export type UsePointerDownReturn<T extends HTMLElement> = React.Ref<T>

export function usePointerDownOutside<T extends HTMLElement = HTMLElement>(
    enabled: boolean,
    callback: UsePointerDownCallback,
): UsePointerDownReturn<T> {
    const ref = React.useRef<T>(null)
    const [ready, setReady] = React.useState(false)
    if (!enabled && ready) {
        setReady(false)
    }

    React.useEffect(() => {
        if (!enabled) {
            return
        }
        setReady(true)
    }, [enabled])

    const callbackRef = useCallbackRef(callback)

    React.useEffect(() => {
        if (!ready) {
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

        const originalPointerEvents = document.body.style.pointerEvents
        document.body.style.pointerEvents = "none"

        document.addEventListener("pointerdown", handler)

        return () => {
            document.body.style.pointerEvents = originalPointerEvents

            document.removeEventListener("pointerdown", handler)
        }
    }, [ready, callbackRef])

    return ref
}

export type UsePointerDownCallback = () => void
