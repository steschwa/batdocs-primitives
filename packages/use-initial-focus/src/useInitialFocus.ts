import { useCallbackRef } from "@batdocs/use-callback-ref"
import * as React from "react"

export function useInitialFocus(enabled: boolean, callback: UseInitialFocusCallback) {
    const [ready, setReady] = React.useState(false)
    if (!enabled && ready) {
        setReady(false)
    }

    const callbackRef = useCallbackRef(callback)

    React.useEffect(() => {
        if (!enabled) {
            return
        }
        setReady(true)
    }, [enabled])

    React.useEffect(() => {
        if (!ready) {
            return
        }

        const focusable = callbackRef()
        focusable?.focus()
    }, [ready, callbackRef])
}

export type UseInitialFocusCallback = () => HTMLElement | null | undefined
