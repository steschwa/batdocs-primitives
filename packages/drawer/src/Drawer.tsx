import { composeEventHandlers } from "@batdocs/compose-event-handlers"
import { useComposedRefs } from "@batdocs/compose-refs"
import { FocusTrap } from "@batdocs/focus-trap"
import { useControllableState } from "@batdocs/use-controllable-state"
import { useInitialFocus } from "@batdocs/use-initial-focus"
import { usePointerDownOutside } from "@batdocs/use-pointer-down-outside"
import * as PortalPrimitives from "@radix-ui/react-portal"
import { Slot, SlotProps } from "@radix-ui/react-slot"
import * as React from "react"
import {
    DrawerContentContext,
    DrawerContext,
    useDrawerContentContext,
    useDrawerContext
} from "./Drawer.context"

export type RootProps = {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    //
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
    /**
     * @default false
     */
    forceMount?: boolean
}
export type ContentProps = ContentOwnProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof ContentOwnProps>
export function Content(props: ContentProps) {
    const { forceMount = false, ...restProps } = props

    const { open, setOpen, trigger } = useDrawerContext()

    const [close, setClose] = React.useState<HTMLElement | null>(null)

    const ref = React.useRef<HTMLDivElement>(null)

    const closeContent = () => {
        setOpen(false)
        setTimeout(() => {
            trigger?.focus({ preventScroll: true })
        })
    }

    const pointerOutsideRef = usePointerDownOutside<HTMLDivElement>(open, closeContent)

    const composedRef = useComposedRefs<HTMLDivElement>(ref, pointerOutsideRef)

    useInitialFocus(open, () => {
        return close
    })

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.code === "Escape") {
            setOpen(false)
        }
    }

    if (!open && !forceMount) {
        return null
    }

    return (
        <DrawerContentContext.Provider value={{ close, setClose }}>
            <FocusTrap asChild>
                <div
                    {...restProps}
                    ref={composedRef}
                    tabIndex={-1}
                    data-open={open}
                    onKeyDown={composeEventHandlers(restProps.onKeyDown, handleKeyDown)}
                />
            </FocusTrap>
        </DrawerContentContext.Provider>
    )
}

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
    const { setClose } = useDrawerContentContext()

    const handleClick = () => {
        setOpen(false)
    }

    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            {...restProps}
            ref={setClose}
            onClick={composeEventHandlers(restProps.onClick, handleClick)}
        />
    )
}
