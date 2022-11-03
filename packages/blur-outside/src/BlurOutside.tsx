import * as React from "react"
import { Slot, SlotProps } from "@radix-ui/react-slot"
import { composeEventHandlers } from "@batdocs/compose-event-handlers"
import { useComposedRefs } from "@batdocs/compose-refs"

type BlurOutsideOwnProps = {
    /**
     * @default false
     */
    asChild?: boolean
    /**
     * Event handler called if focus moves outside of the element
     */
    onBlurOutside: (event: React.FocusEvent<HTMLElement>) => void
}
export type BlurOutsideProps = BlurOutsideOwnProps & Omit<SlotProps, keyof BlurOutsideOwnProps>
export const BlurOutside = React.forwardRef<HTMLElement, BlurOutsideProps>(
    (props, forwardedRef) => {
        const { asChild = false, onBlurOutside, ...restProps } = props

        const ref = React.useRef<HTMLElement>(null)
        const composedRef = useComposedRefs(ref, forwardedRef)

        const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
            if (!ref.current) {
                return
            }

            if (getIsFocusedOutside(ref.current, event)) {
                onBlurOutside(event)
            }
        }

        const Comp = asChild ? Slot : "div"

        return (
            <Comp
                {...restProps}
                ref={composedRef as never}
                onBlur={composeEventHandlers(restProps.onBlur, handleBlur)}
            />
        )
    },
)

function getIsFocusedOutside(outsideOf: HTMLElement, event: React.FocusEvent): boolean {
    if (event.relatedTarget === null) {
        return true
    }
    if (!(event.relatedTarget instanceof HTMLElement)) {
        return false
    }

    if (!outsideOf.contains(event.relatedTarget)) {
        return true
    }

    return false
}
