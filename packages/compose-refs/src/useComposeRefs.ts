import * as React from "react"
import { composeRefs, PossibleRef } from "./composeRefs"

/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 **/
export function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useCallback(composeRefs(...refs), refs)
}
