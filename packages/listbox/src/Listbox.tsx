import { createCollection } from "@batdocs/collection"
import { composeEventHandlers } from "@batdocs/compose-event-handlers"
import { useComposedRefs } from "@batdocs/compose-refs"
import { delayFocus } from "@batdocs/focus"
import { useControllableState } from "@batdocs/use-controllable-state"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import {
    ListboxContext,
    ListboxItemContext,
    useListboxContext,
    useListboxItemContext
} from "./Listbox.context"
import { ItemData } from "./Listbox.types"
import { produceToggleValue } from "./Listbox.utils"
import { useTypeaheadSearch } from "./useTypeaheadSearch"

const [Collection, useCollection] = createCollection<HTMLDivElement, ItemData>("GridList")

export type RootProps = {
    values?: string[]
    defaultValues?: string[]
    onValuesChange?: (values: string[]) => void
    children: React.ReactNode
}
export function Root(props: RootProps) {
    const { values: controlledValues, defaultValues, onValuesChange, children } = props

    const [values = [], setValues] = useControllableState({
        value: controlledValues,
        defaultValue: defaultValues,
        onChange: onValuesChange,
    })

    return (
        <ListboxContext.Provider value={{ values, setValues }}>
            <Collection.Provider>{children}</Collection.Provider>
        </ListboxContext.Provider>
    )
}

export type ContentProps = React.ComponentPropsWithoutRef<"div">
export const Content = React.forwardRef<HTMLDivElement, ContentProps>((props, forwardedRef) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const composedRef = useComposedRefs(ref, forwardedRef)

    const { values, setValues } = useListboxContext()
    const { getItems } = useCollection()

    const { setSearch } = useTypeaheadSearch(getItems)

    const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
        if (event.target !== ref.current) {
            return
        }

        const items = getItems()

        const firstSelectedItem = items.find(item => {
            return values.includes(item.value)
        })

        if (firstSelectedItem) {
            delayFocus(firstSelectedItem.ref.current)
        } else {
            const firstItem = items[0]
            if (firstItem) {
                delayFocus(firstItem.ref.current)
            }
        }
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (["ArrowUp", "ArrowDown"].includes(event.code)) {
            event.preventDefault()
            const items = getItems()
            let candidateNodes = items
                .map(item => {
                    return item.ref.current
                })
                .filter(Boolean) as HTMLDivElement[]

            if (["ArrowUp"].includes(event.code)) {
                candidateNodes = candidateNodes.slice().reverse()
            }

            const currentItem = event.target as HTMLDivElement
            const currentIndex = candidateNodes.indexOf(currentItem)
            candidateNodes = candidateNodes.slice(currentIndex + 1)

            const focusable = candidateNodes[0]
            if (focusable) {
                delayFocus(focusable)
            }

            if (event.shiftKey && focusable !== null) {
                const item = items.find(item => {
                    return item.ref.current === focusable
                })

                if (!item) {
                    return
                }

                setValues(produceToggleValue(values, item.value))
            }
        } else if ((event.metaKey || event.ctrlKey) && event.key === "a") {
            event.preventDefault()
            const allValues = getItems().map(item => {
                return item.value
            })
            if (allValues.length === values.length) {
                setValues([])
            } else {
                setValues(allValues)
            }
        } else if (event.key.length === 1) {
            event.preventDefault()
            setSearch(prev => `${prev}${event.key}`)
        }
    }

    return (
        <Collection.Slot ref={composedRef}>
            <div
                {...props}
                aria-label={props["aria-label"] || "Select values"}
                role="listbox"
                aria-multiselectable="true"
                tabIndex={0}
                onKeyDown={composeEventHandlers(props.onKeyDown, handleKeyDown)}
                onFocus={composeEventHandlers(props.onFocus, handleFocus)}
            />
        </Collection.Slot>
    )
})

type ItemOwnProps = {
    value: string
    text?: string
    disabled?: boolean
}
export type ItemProps = ItemOwnProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof ItemOwnProps>
export function Item(props: ItemProps) {
    const { value, text = value, disabled = false, ...restProps } = props

    const { values, setValues } = useListboxContext()

    const toggleValue = () => {
        setValues(produceToggleValue(values, value))
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (["Space", "Enter"].includes(event.code)) {
            event.preventDefault()
            toggleValue()
        }
    }
    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.isDefaultPrevented()) {
            return
        }

        event.currentTarget.focus()
    }
    const handlePointerDown = () => {
        toggleValue()
    }

    const isSelected = values.includes(value)

    return (
        <ListboxItemContext.Provider value={{ value }}>
            <Collection.ItemSlot value={value} text={text} disabled={disabled}>
                <div
                    {...restProps}
                    role="option"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    onKeyDown={composeEventHandlers(props.onKeyDown, handleKeyDown)}
                    onMouseEnter={composeEventHandlers(props.onMouseEnter, handleMouseEnter)}
                    onPointerDown={composeEventHandlers(props.onPointerDown, handlePointerDown)}
                />
            </Collection.ItemSlot>
        </ListboxItemContext.Provider>
    )
}

type IndicatorOwnProps = {
    asChild?: boolean
    forceMount?: boolean
}
export type IndicatorProps = IndicatorOwnProps &
    Omit<React.ComponentPropsWithoutRef<"span">, keyof IndicatorOwnProps>
export function Indicator(props: IndicatorProps) {
    const { asChild = false, forceMount = false, ...restProps } = props

    const { values } = useListboxContext()
    const { value } = useListboxItemContext()

    const Comp = asChild ? Slot : "span"

    const isSelected = values.includes(value)
    if (!isSelected && !forceMount) {
        return null
    }

    return <Comp {...restProps} />
}
