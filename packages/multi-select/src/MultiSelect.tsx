import { useControllableState } from "@batdocs/use-controllable-state"
import * as React from "react"
import {
    MultiSelectContext,
    MultiSelectItemContext,
    useMultiSelectContext,
    useMultiSelectItemContext,
} from "./MultiSelect.context"
import { Slot, SlotProps } from "@radix-ui/react-slot"
import {
    useFloating,
    offset as offsetMiddleware,
    size as sizeMiddleware,
    flip as flipMiddleware,
} from "@floating-ui/react-dom"
import { useComposedRefs } from "@batdocs/compose-refs"
import { composeStyles } from "@batdocs/compose-styles"
import { Collection, useCollection } from "./MultiSelect.collection"
import { produceToggleValue } from "./MultiSelect.utils"
import { useTypeaheadSearch } from "./useTypeaheadSearch"
import { composeEventHandlers } from "@batdocs/compose-event-handlers"

export type RootProps = {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    //
    values?: string[]
    defaultValues?: string[]
    onValuesChange?: (values: string[]) => void
    //
    disabled?: boolean
    children: React.ReactNode
}
export function Root(props: RootProps) {
    const {
        open: controlledOpen,
        defaultOpen,
        onOpenChange,
        //
        values: controlledValues,
        defaultValues,
        onValuesChange,
        //
        disabled = false,
        children,
    } = props

    const [open = false, setOpen] = useControllableState({
        value: controlledOpen,
        defaultValue: defaultOpen,
        onChange: onOpenChange,
    })

    const [values = [], setValues] = useControllableState({
        value: controlledValues,
        defaultValue: defaultValues,
        onChange: onValuesChange,
    })

    const [trigger, setTrigger] = React.useState<HTMLElement | null>(null)

    return (
        <MultiSelectContext.Provider
            value={{ open, setOpen, values, setValues, trigger, setTrigger, disabled }}>
            <Collection.Provider>{children}</Collection.Provider>
        </MultiSelectContext.Provider>
    )
}

type TriggerOwnProps = {
    /**
     * @default false
     */
    asChild?: boolean
}
export type TriggerProps = TriggerOwnProps & Omit<SlotProps, keyof TriggerOwnProps>
export function Trigger(props: TriggerProps) {
    const { asChild = false, ...restProps } = props

    const { setOpen, setTrigger, disabled } = useMultiSelectContext()

    const open = () => {
        if (!disabled) {
            setOpen(true)
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (["Space", "Enter"].includes(event.code)) {
            open()
        }
    }
    const handlePointerDown = (event: React.PointerEvent) => {
        event.preventDefault()
        open()
    }

    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            {...restProps}
            ref={setTrigger}
            disabled={disabled}
            onKeyDown={composeEventHandlers(restProps.onKeyDown, handleKeyDown)}
            onPointerDown={composeEventHandlers(restProps.onPointerDown, handlePointerDown)}
        />
    )
}

type ValuesOwnProps = {
    /**
     * @default false
     */
    asChild?: boolean
    placeholder?: string
}
export type ValuesProps = ValuesOwnProps & Omit<SlotProps, keyof ValuesOwnProps>
export function Values(props: ValuesProps) {
    const { asChild = false, children, placeholder, ...restProps } = props

    const { values } = useMultiSelectContext()

    const showPlaceholder = values.length === 0

    const renderChildren = () => {
        if (showPlaceholder) {
            return placeholder
        }

        if (children) {
            return children
        }

        return values.join(", ")
    }

    const Comp = asChild ? Slot : "span"

    return (
        <Comp {...restProps} data-placeholder={showPlaceholder}>
            {renderChildren()}
        </Comp>
    )
}

export type IconProps = React.ComponentPropsWithoutRef<"span">
export function Icon(props: IconProps) {
    return <span {...props} />
}

type ContentOwnProps = {
    /**
     * @default false
     */
    forceMount?: boolean
    /**
     * @default 0
     */
    offset?: number
}
export type ContentProps = ContentOwnProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof ContentOwnProps>
export function Content(props: ContentProps) {
    const { forceMount = false, offset = 0, ...restProps } = props

    const { open, setOpen, trigger, values, setValues } = useMultiSelectContext()

    const [initialized, setInitialized] = React.useState(false)
    if (!open && initialized) {
        setInitialized(false)
    }

    const ref = React.useRef<HTMLDivElement>(null)
    const { reference, floating, x, y } = useFloating({
        placement: "bottom-start",
        middleware: [
            offsetMiddleware(offset),
            sizeMiddleware({
                apply({ rects, elements }) {
                    Object.assign(elements.floating.style, {
                        minWidth: `${rects.reference.width}px`,
                    })
                },
            }),
            flipMiddleware({
                mainAxis: true,
                crossAxis: true,
                fallbackPlacements: ["bottom", "bottom-end", "top-start", "top", "top-end"],
            }),
        ],
    })

    const composedRefs = useComposedRefs<HTMLDivElement>(ref, floating)

    React.useLayoutEffect(() => {
        reference(trigger)
    }, [reference, trigger])

    const { getItems } = useCollection()
    const { setSearch } = useTypeaheadSearch()

    const closeContent = React.useCallback(() => {
        setOpen(false)
        setTimeout(() => {
            trigger?.focus({ preventScroll: true })
        })
    }, [setOpen, trigger])

    const getEnabledItems = React.useCallback(() => {
        return getItems().filter(item => !item.disabled)
    }, [getItems])

    React.useEffect(() => {
        if (!initialized) {
            return
        }

        const handler = (event: PointerEvent) => {
            if (!ref.current) {
                return
            }

            if (!ref.current.contains(event.target as HTMLElement)) {
                closeContent()
            }
        }

        document.addEventListener("pointerdown", handler)
        return () => {
            document.removeEventListener("pointerdown", handler)
        }
    }, [initialized, closeContent])

    React.useEffect(() => {
        if (!initialized) {
            return
        }

        const originalPointerEvents = document.body.style.pointerEvents
        document.body.style.pointerEvents = "none"

        return () => {
            document.body.style.pointerEvents = originalPointerEvents
        }
    }, [initialized])

    React.useEffect(() => {
        if (!open || initialized) {
            return
        }

        const items = getEnabledItems()
        const firstSelectedItem = items.find(item => {
            return values.includes(item.value)
        })

        if (firstSelectedItem) {
            firstSelectedItem.ref.current?.focus()
        } else {
            const [first] = items
            if (first) {
                first.ref.current?.focus()
            }
        }

        setInitialized(true)
    }, [open, getEnabledItems, values, initialized])

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.code === "Tab") {
            event.preventDefault()
        } else if (event.code === "Escape") {
            closeContent()
        } else if (["ArrowUp", "ArrowDown"].includes(event.code)) {
            const items = getEnabledItems()
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
                focusable.focus()
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
            const allValues = getEnabledItems().map(item => {
                return item.value
            })
            if (allValues.length === values.length) {
                setValues([])
            } else {
                setValues(allValues)
            }
        } else if (event.key.length === 1) {
            setSearch(prev => `${prev}${event.key}`)
        }
    }

    if (!open && !forceMount) {
        return null
    }

    return (
        <Collection.Slot ref={composedRefs}>
            <div
                {...restProps}
                role="listbox"
                aria-multiselectable="true"
                style={composeStyles(
                    restProps.style,
                    {
                        position: "absolute",
                        left: x ?? 0,
                        top: y ?? 0,
                    },
                    { pointerEvents: "auto" },
                )}
                onKeyDown={composeEventHandlers(restProps.onKeyDown, handleKeyDown)}
            />
        </Collection.Slot>
    )
}

type ItemOwnProps = {
    value: string
    text?: string
    disabled?: boolean
}
export type ItemProps = ItemOwnProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof ItemOwnProps>
export function Item(props: ItemProps) {
    const { value, text = value, disabled = false, ...restProps } = props

    const { values, setValues } = useMultiSelectContext()

    const toggleValue = () => {
        setValues(produceToggleValue(values, value))
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (["Space", "Enter"].includes(event.code)) {
            event.preventDefault()
            toggleValue()
        }
    }
    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        event.currentTarget.focus()
    }
    const handlePointerDown = () => {
        toggleValue()
    }

    const selected = values.includes(value)

    return (
        <MultiSelectItemContext.Provider value={{ selected }}>
            <Collection.ItemSlot value={value} text={text} disabled={disabled}>
                <div
                    {...restProps}
                    role="option"
                    aria-checked={selected}
                    data-disabled={disabled}
                    tabIndex={-1}
                    onKeyDown={composeEventHandlers(restProps.onKeyDown, handleKeyDown)}
                    onMouseEnter={composeEventHandlers(restProps.onMouseEnter, handleMouseEnter)}
                    onPointerDown={composeEventHandlers(restProps.onPointerDown, handlePointerDown)}
                />
            </Collection.ItemSlot>
        </MultiSelectItemContext.Provider>
    )
}

export type IndicatorProps = React.ComponentPropsWithoutRef<"span">
export function Indicator(props: IndicatorProps) {
    const { selected } = useMultiSelectItemContext()

    if (!selected) {
        return null
    }

    return <span {...props} />
}
