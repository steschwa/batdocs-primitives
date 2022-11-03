import { composeEventHandlers } from "@batdocs/compose-event-handlers"
import { delayFocus } from "@batdocs/focus"
import { FocusTrap } from "@batdocs/focus-trap"
import { useCallbackRef } from "@batdocs/use-callback-ref"
import { useControllableState } from "@batdocs/use-controllable-state"
import * as PortalPrimitives from "@radix-ui/react-portal"
import { Slot, SlotProps } from "@radix-ui/react-slot"
import * as React from "react"
import { DrawerContext, useDrawerContext } from "./Drawer.context"

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

    return (
        <DrawerContext.Provider value={{ open, setOpen, trigger, setTrigger }}>
            {children}
        </DrawerContext.Provider>
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

    const { setOpen, setTrigger } = useDrawerContext()

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

type OverlayOwnProps = {
    /**
     * @default false
     */
    forceMount?: boolean
}
export type OverlayProps = OverlayOwnProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof OverlayOwnProps>
export function Overlay(props: OverlayProps) {
    const { forceMount = false, ...restProps } = props

    const { open } = useDrawerContext()

    if (!open && !forceMount) {
        return null
    }

    return <div {...restProps} data-open={open} />
}

type ContentOwnProps = {
    side: ContentSide
    /**
     * @default false
     */
    forceMount?: boolean
    /**
     * Event handler called when the Escape key is down.
     * By default this closes the drawer.
     * Can be prevented with `event.preventDefault()`
     */
    onEscapeKeyDown?: (event: React.KeyboardEvent) => void
    /**
     * Event handler called when a pointer event is fired outside the content.
     * By default this closes the drawer.
     * Can be prevented with `event.preventDefault()`
     */
    onPointerDownOutside?: (event: MouseEvent) => void
}
export type ContentProps = ContentOwnProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof ContentOwnProps>
export function Content(props: ContentProps) {
    const { side, forceMount = false, onEscapeKeyDown, onPointerDownOutside, ...restProps } = props

    const { open, setOpen, trigger } = useDrawerContext()
    const [previousOpen, setPreviousOpen] = React.useState(false)

    const ref = React.useRef<HTMLDivElement>(null)

    const latestOnPointerDownOutside = useCallbackRef(onPointerDownOutside)

    React.useEffect(() => {
        if (!open) {
            return
        }

        const clickHandler = (event: PointerEvent) => {
            if (!ref.current) {
                return
            }
            if (!(event.target instanceof HTMLElement)) {
                return
            }

            if (event.target !== ref.current && !ref.current.contains(event.target)) {
                latestOnPointerDownOutside(event)

                if (!event.defaultPrevented) {
                    setOpen(false)
                }
            }
        }

        document.addEventListener("pointerdown", clickHandler)
        return () => {
            document.removeEventListener("pointerdown", clickHandler)
        }
    }, [open, setOpen, latestOnPointerDownOutside])

    React.useEffect(() => {
        if (!open && previousOpen) {
            delayFocus(trigger, { preventScroll: true })
        } else if (open && !previousOpen) {
            delayFocus(ref.current)
        }

        if (open !== previousOpen) {
            setPreviousOpen(open)
        }
    }, [open, previousOpen, trigger])

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.code === "Escape") {
            onEscapeKeyDown?.(event)

            if (!event.isDefaultPrevented()) {
                setOpen(false)
            }
        }
    }

    if (!open && !forceMount) {
        return null
    }

    return (
        <FocusTrap asChild>
            <div
                {...restProps}
                ref={ref}
                tabIndex={-1}
                data-side={side}
                data-open={open}
                onKeyDown={composeEventHandlers(restProps.onKeyDown, handleKeyDown)}
            />
        </FocusTrap>
    )
}
type ContentSide = "right" | "left"

type CloseOwnProps = {
    /**
     * @default false
     */
    asChild?: boolean
}
export type CloseProps = CloseOwnProps & Omit<SlotProps, keyof CloseOwnProps>
export function Close(props: CloseProps) {
    const { asChild = false, ...restProps } = props

    const { setOpen } = useDrawerContext()

    const handleClick = () => {
        setOpen(false)
    }

    const Comp = asChild ? Slot : "button"

    return <Comp {...restProps} onClick={composeEventHandlers(restProps.onClick, handleClick)} />
}
