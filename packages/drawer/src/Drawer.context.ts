import { createContext, useContext } from "react"

type DrawerContextProps = {
    open: boolean
    setOpen: (open: boolean) => void
    //
    trigger: HTMLElement | null
    setTrigger: (element: HTMLElement | null) => void
}
export const DrawerContext = createContext<DrawerContextProps>({
    open: false,
    setOpen: noop,
    //
    trigger: null,
    setTrigger: noop,
})
export function useDrawerContext() {
    return useContext(DrawerContext)
}

function noop() {
    return
}
