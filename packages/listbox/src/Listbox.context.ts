import { createContext, useContext } from "react"

type ListboxContextProps = {
    values: string[]
    setValues: (values: string[]) => void
}
export const ListboxContext = createContext<ListboxContextProps>({
    values: [],
    setValues: noop,
})
export function useListboxContext() {
    return useContext(ListboxContext)
}

type ListboxItemContextProps = {
    value: string
}
export const ListboxItemContext = createContext<ListboxItemContextProps>({
    value: "",
})
export function useListboxItemContext() {
    return useContext(ListboxItemContext)
}

function noop() {
    return
}
