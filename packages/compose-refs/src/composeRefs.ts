import * as React from "react"

export type PossibleRef<T> = React.Ref<T> | undefined

/**
 * Set a given ref to a given value
 * This utility takes care of different types of refs: callback refs and RefObject(s)
 **/
function setRef<T>(ref: PossibleRef<T>, value: T) {
    if (typeof ref === "function") {
        ref(value)
    } else if (ref !== null && ref !== undefined) {
        const mutableRef = ref as React.MutableRefObject<T>
        mutableRef.current = value
    }
}

/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 **/
export function composeRefs<T>(...refs: PossibleRef<T>[]) {
    return (node: T) => refs.forEach(ref => setRef(ref, node))
}
