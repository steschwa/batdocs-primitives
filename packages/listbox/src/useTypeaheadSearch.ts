import { delayFocus } from "@batdocs/focus"
import * as React from "react"
import { ListboxCollectionItem } from "./Listbox.types"

type UseTypeaheadSearchReturn = {
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export function useTypeaheadSearch(getItemsFn: GetItemsFn): UseTypeaheadSearchReturn {
    const [search, setInternalSearch] = React.useState("")
    const timeout = React.useRef<NodeJS.Timeout>()

    React.useEffect(() => {
        if (search === "") {
            return
        }

        const clearPreviousTimeout = () => {
            if (timeout.current !== undefined) {
                clearTimeout(timeout.current)
            }
        }

        clearPreviousTimeout()
        timeout.current = setTimeout(() => {
            setInternalSearch("")
        }, 1000)

        return () => {
            clearPreviousTimeout()
        }
    }, [search])

    const setSearch: React.Dispatch<React.SetStateAction<string>> = value => {
        const nextSearch = computed(() => {
            if (typeof value === "function") {
                return value(search)
            }

            return value
        })

        setInternalSearch(nextSearch)

        const currentFocusedItem = getItemsFn().find(item => {
            return item.ref.current === document.activeElement
        })

        const nextItem = typeaheadSearch(nextSearch, getItemsFn(), currentFocusedItem)
        if (nextItem) {
            delayFocus(nextItem.ref.current)
        }
    }

    return { setSearch }
}

type GetItemsFn = () => ListboxCollectionItem[]

function computed<Fn extends (...args: never[]) => unknown>(fn: Fn): ReturnType<Fn> {
    return fn() as ReturnType<Fn>
}

function typeaheadSearch<T extends ListboxCollectionItem>(
    search: string,
    items: T[],
    currentItem?: T,
): T | undefined {
    const isRepeated =
        search.length > 1 &&
        Array.from(search).every(char => {
            return char === search[0]
        })
    const normalizedSearch = isRepeated ? search[0] : search
    const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1

    let wrappedItems = wrapArray(items, Math.max(currentItemIndex, 0))
    const excludeCurrentItem = normalizedSearch.length === 1
    if (excludeCurrentItem) {
        wrappedItems = wrappedItems.filter(item => {
            return item !== currentItem
        })
    }

    const nextItem = wrappedItems.find(item => {
        return item.text.toLowerCase().startsWith(normalizedSearch.toLowerCase())
    })

    return nextItem !== currentItem ? nextItem : undefined
}

function wrapArray<T>(array: T[], startIndex: number) {
    return array.map((_, index) => array[(startIndex + index) % array.length])
}
