import { composeEventHandlers } from "@batdocs/compose-event-handlers"
import { useComposedRefs } from "@batdocs/compose-refs"
import { composeStyles } from "@batdocs/compose-styles"
import { delayFocus, getAllFocusable, useFocusOutside, useTrapFocus } from "@batdocs/focus"
import { useCallbackRef } from "@batdocs/use-callback-ref"
import { useControllableState } from "@batdocs/use-controllable-state"
import * as PortalPrimitives from "@radix-ui/react-portal"
import { Slot, SlotProps } from "@radix-ui/react-slot"
import * as React from "react"
import { FloatingContext, useFloatingContext } from "./Floating.context"
import { useFloatingPlacement } from "./useFloatingPlacement"

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
    /**
     * Event handler called when the floating content opens.
     * By default this moves focus to the first focusable children (if any).
     * or the content itself.
     * Can be prevented with `event.preventDefault()` to force focus of the
     * content.
     */
    onOpenAutoFocus?: (event: Event) => void
    /**
     * Event handler called when the floating content closes.
     * By default this moves focus back to the trigger.
     * Can be prevented with `event.preventDefault()`
     */
    onCloseAutoFocus?: (event: Event) => void
    /**
     * Event handler called when the Escape key is down.
     * By default this closes the floating content.
     * Can be prevented with `event.preventDefault()`
     */
    onEscapeKeyDown?: (event: React.KeyboardEvent) => void
    /**
     * Event handler called when focus moves outside of the floating content.
     * By default this closes the floating content.
     * Can be prevented with `event.preventDefault()`
     */
    onBlurOutside?: (event: React.FocusEvent) => void
}
export type ContentProps = ContentOwnProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof ContentOwnProps>
export function Content(props: ContentProps) {
    const {
        offset = 0,
        forceMount = false,
        fitTrigger = true,
        onOpenAutoFocus,
        onCloseAutoFocus,
        onEscapeKeyDown,
        onBlurOutside,
        ...restProps
    } = props

    const { open, setOpen, trigger } = useFloatingContext()
    const [previousOpen, setPreviousOpen] = React.useState(false)

    const ref = React.useRef<HTMLDivElement>(null)
    const { ref: floatingRef, styles: floatingStyles } = useFloatingPlacement({
        offset,
        fitTrigger,
    })

    const { ref: trapFocusRef, onKeyDown: trapFocusKeyDown } = useTrapFocus()
    const { ref: focusOutsideRef, onBlur: focusOutsideBlur } = useFocusOutside({
        onBlurOutside: event => {
            onBlurOutside?.(event)
            if (!event.isDefaultPrevented()) {
                setOpen(false)
            }
        },
    })

    const composedRef = useComposedRefs<HTMLDivElement | null>(
        ref,
        floatingRef,
        trapFocusRef,
        focusOutsideRef,
    )

    const latestOnOpenAutoFocus = useCallbackRef(onOpenAutoFocus)
    const latestOnCloseAutoFocus = useCallbackRef(onCloseAutoFocus)

    React.useEffect(() => {
        if (!open && previousOpen) {
            computed(() => {
                const event = new Event("onCloseAutoFocus", {
                    cancelable: true,
                })
                latestOnCloseAutoFocus(event)

                if (!event.defaultPrevented) {
                    trigger?.focus({ preventScroll: true })
                }
            })
        } else if (open && !previousOpen) {
            computed(() => {
                const event = new Event("onOpenAutoFocus", {
                    cancelable: true,
                })
                latestOnOpenAutoFocus(event)

                const focusableChildren = getAllFocusable(ref.current)
                if (focusableChildren.length === 0 || event.defaultPrevented) {
                    delayFocus(ref.current)
                    return
                }

                if (!event.defaultPrevented) {
                    delayFocus(focusableChildren[0])
                }
            })
        }

        if (open !== previousOpen) {
            setPreviousOpen(open)
        }
    }, [open, previousOpen, trigger, latestOnOpenAutoFocus, latestOnCloseAutoFocus])

    if (!open && !forceMount) {
        return null
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.code === "Escape") {
            onEscapeKeyDown?.(event)

            if (!event.isDefaultPrevented()) {
                setOpen(false)
            }
        }
    }

    return (
        <div
            {...restProps}
            ref={composedRef}
            data-open={open}
            tabIndex={-1}
            onKeyDown={composeEventHandlers(restProps.onKeyDown, handleKeyDown, trapFocusKeyDown)}
            onBlur={composeEventHandlers(restProps.onBlur, focusOutsideBlur)}
            style={composeStyles(restProps.style, floatingStyles)}
        />
    )
}

function computed<T>(fn: () => T): T {
    return fn()
}
