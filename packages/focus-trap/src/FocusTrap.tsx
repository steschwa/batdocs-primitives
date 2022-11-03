import * as React from "react"
import { Slot, SlotProps } from "@radix-ui/react-slot"
import { composeEventHandlers } from "@batdocs/compose-event-handlers"
import { getAllFocusable } from "@batdocs/focus"

type FocusTrapOwnProps = {
    /**
     * @default false
     */
    asChild?: boolean
}
export type FocusTrapProps = FocusTrapOwnProps & Omit<SlotProps, keyof FocusTrapOwnProps>
export function FocusTrap(props: FocusTrapProps) {
    const { asChild = false, ...restProps } = props

    const ref = React.useRef<HTMLElement>(null)

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!ref.current) {
            return
        }
        if (event.code === "Tab") {
            scopeTab(ref.current, event)
        }
    }

    const Comp = asChild ? Slot : "div"

    return (
        <Comp
            {...restProps}
            ref={ref as never}
            tabIndex={-1}
            onKeyDown={composeEventHandlers(restProps.onKeyDown, handleKeyDown)}
        />
    )
}

function scopeTab(inside: HTMLElement, event: React.KeyboardEvent) {
    const focusableChildren = getAllFocusable(inside)
    if (focusableChildren.length === 0) {
        event.preventDefault()
        return
    }

    const finalFocusable = focusableChildren[event.shiftKey ? 0 : focusableChildren.length - 1]
    const leavingFinalFocusable =
        finalFocusable === document.activeElement || document.activeElement === inside

    if (!leavingFinalFocusable) {
        return
    }

    event.preventDefault()

    const target = focusableChildren[event.shiftKey ? focusableChildren.length - 1 : 0]
    if (target) {
        target.focus()
    }
}
