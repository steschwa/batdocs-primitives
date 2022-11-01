import * as React from "react"
import { useControllableState } from "@batdocs/use-controllable-state"
import { FloatingContext, useFloatingContext } from "./Floating.context"
import { Slot, SlotProps } from "@radix-ui/react-slot"
import { composeEventHandlers } from "@batdocs/compose-event-handlers"
import * as PortalPrimitives from "@radix-ui/react-portal"
import { getAllFocusable, getIsFocusedOutside, scopeTab } from "@batdocs/focus"
import {
    useFloating,
    offset as offsetMiddleware,
    size as sizeMiddleware,
} from "@floating-ui/react-dom"
import { composeStyles } from "@batdocs/compose-styles"
import { useComposedRefs } from "@batdocs/compose-refs"

export type RootProps = {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}
export function Root(props: RootProps) {
    const { open: controlledOpen, defaultOpen, onOpenChange, children } = props

    const [open = false, setOpen] = useControllableState({
        value: controlledOpen,
        defaultValue: defaultOpen,
        onChange: onOpenChange,
    })
    const [previousOpen, setPreviousOpen] = React.useState(open)
    const [trigger, setTrigger] = React.useState<HTMLElement | null>(null)

    React.useEffect(() => {
        if (open === false && previousOpen === true) {
            trigger?.focus()
        }

        if (open !== previousOpen) {
            setPreviousOpen(open)
        }
    }, [open, previousOpen, trigger])

    return (
        <FloatingContext.Provider value={{ open, setOpen, trigger, setTrigger }}>
            {children}
        </FloatingContext.Provider>
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

    const { setTrigger, setOpen } = useFloatingContext()

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.isDefaultPrevented()) {
            return
        }

        if (["Space", "Enter"].includes(event.code)) {
            setOpen(true)
        }
    }
    const handlePointerDown = (event: React.PointerEvent) => {
        event.preventDefault()
        setOpen(true)
    }

    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            {...restProps}
            ref={setTrigger}
            onKeyDown={composeEventHandlers(restProps.onKeyDown, handleKeyDown)}
            onPointerDown={composeEventHandlers(restProps.onPointerDown, handlePointerDown)}
        />
    )
}

export type PortalProps = PortalPrimitives.PortalProps
export const Portal = PortalPrimitives.Root

type ContentOwnProps = {
    /**
     * @default 0
     */
    offset?: number
    /**
     * @default false
     */
    forceMount?: boolean
    /**
     * @default true
     */
    fitTrigger?: boolean
}
export type ContentProps = ContentOwnProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof ContentOwnProps>
export function Content(props: ContentProps) {
    const { offset = 0, forceMount = false, fitTrigger = true, ...restProps } = props

    const { open, setOpen, trigger } = useFloatingContext()

    const ref = React.useRef<HTMLDivElement>(null)
    const { reference, floating, x, y } = useFloating({
        middleware: [
            offsetMiddleware(offset),
            sizeMiddleware({
                apply: ({ rects, elements }) => {
                    Object.assign(elements.floating.style, {
                        width: fitTrigger ? `${rects.reference.width}px` : "max-content",
                    })
                },
            }),
        ],
    })
    const composedRef = useComposedRefs<HTMLDivElement | null>(floating, ref)

    React.useLayoutEffect(() => {
        reference(trigger)
    }, [reference, trigger])

    React.useEffect(() => {
        if (!open) {
            return
        }

        requestAnimationFrame(() => {
            if (!ref.current) {
                return
            }
            const focusableChildren = getAllFocusable(ref.current)
            if (focusableChildren.length === 0) {
                ref.current.focus()
                return
            }

            focusableChildren[0].focus()
        })
    }, [open])

    if (!open && !forceMount) {
        return null
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        // TODO maybe separate the actions of "Escape" and "Tab" with custom handlers like Radix
        if (event.isDefaultPrevented()) {
            return
        }

        if (event.code === "Escape") {
            setOpen(false)
            return
        }

        if (event.code === "Tab" && ref.current) {
            scopeTab(ref.current, event.nativeEvent as KeyboardEvent)
            return
        }
    }
    const handleBlur = (event: React.FocusEvent) => {
        if (event.isDefaultPrevented()) {
            return
        }

        if (!ref.current) {
            return
        }
        if (getIsFocusedOutside(ref.current, event.nativeEvent as FocusEvent)) {
            setOpen(false)
        }
    }

    return (
        <div
            {...restProps}
            ref={composedRef}
            data-open={open}
            tabIndex={-1}
            onKeyDown={composeEventHandlers(restProps.onKeyDown, handleKeyDown)}
            onBlur={composeEventHandlers(restProps.onBlur, handleBlur)}
            style={composeStyles(restProps.style, {
                position: "absolute",
                left: x ?? 0,
                top: y ?? 0,
            })}
        />
    )
}
