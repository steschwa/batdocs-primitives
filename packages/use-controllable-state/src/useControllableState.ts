import { useCallbackRef } from "@batdocs/use-callback-ref"
import * as React from "react"

export type UseControllableStateParams<T> = {
    value?: T | undefined
    defaultValue?: T | undefined
    onChange?: (state: T) => void
}

export function useControllableState<T>(params: UseControllableStateParams<T>) {
    const { value, defaultValue, onChange = noop } = params

    const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
        defaultValue,
        onChange,
    })
    const isControlled = value !== undefined
    const finalValue = isControlled ? value : uncontrolledProp
    const handleChange = useCallbackRef(onChange)

    const setValue: React.Dispatch<React.SetStateAction<T | undefined>> = React.useCallback(
        nextValue => {
            if (isControlled) {
                const setter = nextValue as SetStateFn<T>
                const nextState = typeof nextValue === "function" ? setter(value) : nextValue
                if (nextState !== value) handleChange(nextState as T)
            } else {
                setUncontrolledProp(nextValue)
            }
        },
        [isControlled, value, setUncontrolledProp, handleChange],
    )

    return [finalValue, setValue] as const
}

function useUncontrolledState<T>(params: Omit<UseControllableStateParams<T>, "value">) {
    const { defaultValue, onChange } = params

    const uncontrolledState = React.useState<T | undefined>(defaultValue)
    const [value] = uncontrolledState
    const prevValueRef = React.useRef(value)
    const handleChange = useCallbackRef(onChange)

    React.useEffect(() => {
        if (prevValueRef.current !== value) {
            handleChange(value as T)
            prevValueRef.current = value
        }
    }, [value, prevValueRef, handleChange])

    return uncontrolledState
}

type SetStateFn<T> = (prevState?: T) => T

function noop() {
    return
}
