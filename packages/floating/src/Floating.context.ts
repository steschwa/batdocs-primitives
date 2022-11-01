import { createContext, useContext } from "react"

type FloatingContextProps = {
    open: boolean
    setOpen: (open: boolean) => void
    //
    trigger: HTMLElement | null
    setTrigger: (element: HTMLElement | null) => void
}
export const FloatingContext = createContext<FloatingContextProps>({
    open: false,
    setOpen: noop,
    //
    trigger: null,
    setTrigger: noop,
})
export function useFloatingContext() {
    return useContext(FloatingContext)
}

function noop() {
    return
}
