import { createContext, useContext } from "react"

type MultiSelectContextProps = {
    open: boolean
    setOpen: (open: boolean) => void
    //
    values: string[]
    setValues: (values: string[]) => void
    //
    disabled: boolean
    //
    trigger: HTMLElement | null
    setTrigger: (element: HTMLElement | null) => void
}
export const MultiSelectContext = createContext<MultiSelectContextProps>({
    open: false,
    setOpen: noop,
    //
    values: [],
    setValues: noop,
    //
    disabled: false,
    //
    trigger: null,
    setTrigger: noop,
})
export function useMultiSelectContext() {
    return useContext(MultiSelectContext)
}

type MultiSelectItemContextProps = {
    selected: boolean
}
export const MultiSelectItemContext = createContext<MultiSelectItemContextProps>({
    selected: false,
})
export function useMultiSelectItemContext() {
    return useContext(MultiSelectItemContext)
}

function noop() {
    return
}
