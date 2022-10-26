import { composeEventHandlers } from "@batdocs/compose-event-handlers"
import { useComposedRefs } from "@batdocs/compose-refs"
import { composeStyles } from "@batdocs/compose-styles"
import { saveFocus, useFocusWithin } from "@batdocs/focus"
import { useControllableState } from "@batdocs/use-controllable-state"
import { offset as offsetMiddleware, useFloating } from "@floating-ui/react-dom"
import { Slot, SlotProps } from "@radix-ui/react-slot"
import * as React from "react"
import { FloatingContext, useFloatingContext } from "./Floating.context"
import * as PortalPrimitives from "@radix-ui/react-portal"

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
    const [trigger, setTrigger] = React.useState<HTMLElement | null>(null)
    const [content, setContent] = React.useState<HTMLElement | null>(null)

    React.useEffect(() => {
        if (!open) {
            return
        }

        saveFocus(content, { preventScroll: true })
    }, [open, content])

    return (
        <FloatingContext.Provider
            value={{ open, setOpen, trigger, setTrigger, content, setContent }}>
            {children}
        </FloatingContext.Provider>
    )
}

export type TriggerProps = SlotProps & {
    /**
     * @default false
     */
    asChild?: boolean
}
export function Trigger(props: TriggerProps) {
    const { asChild = false, ...restProps } = props

    const { setTrigger, setOpen } = useFloatingContext()

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (["Enter", "Space"].includes(event.code)) {
            setOpen(true)
        }
    }
    const handlePointerDown = () => {
        setOpen(true)
    }

    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            {...restProps}
            ref={setTrigger}
            onKeyDown={composeEventHandlers(props.onKeyDown, handleKeyDown)}
            onPointerDown={composeEventHandlers(props.onPointerDown, handlePointerDown)}
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
}
export type ContentProps = ContentOwnProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof ContentOwnProps>
export function Content(props: ContentProps) {
    const { offset = 0, forceMount = false, ...restProps } = props

    const { open, setOpen, trigger, setContent } = useFloatingContext()

    const { ref: focusWithinRef } = useFocusWithin({
        onBlur: () => setOpen(false),
    })
    const { x, y, strategy, floating, reference } = useFloating({
        middleware: [offsetMiddleware(offset)],
    })
    const ref = useComposedRefs<HTMLDivElement | null>(setContent, focusWithinRef, floating)

    React.useLayoutEffect(() => {
        reference(trigger)
    }, [reference, trigger])

    if (!open && !forceMount) {
        return null
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.code === "Escape") {
            setOpen(false)
        }
    }

    const { width } = trigger?.getBoundingClientRect() ?? { width: 0 }

    const contentStyles: React.CSSProperties = {
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        width: width,
    }

    return (
        <div
            {...restProps}
            ref={ref}
            tabIndex={-1}
            style={composeStyles(contentStyles, restProps.style)}
            onKeyDown={composeEventHandlers(restProps.onKeyDown, handleKeyDown)}
        />
    )
}
