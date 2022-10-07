import { useEffect, useMemo, useRef } from "react"

export function useCallbackRef<T extends AnyFn>(callback: T | undefined): T {
    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current = callback
    })

    return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, [])
}

type AnyFn = (...args: never[]) => unknown
