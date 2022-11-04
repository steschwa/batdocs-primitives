import {
    useFloating,
    offset as offsetMiddleware,
    size as sizeMiddleware,
} from "@floating-ui/react-dom"
import { useLayoutEffect } from "react"
import { useFloatingContext } from "./Floating.context"

type UseFloatingPlacementOptions = {
    /**
     * @default 0
     */
    offset?: number
    /**
     * @default false
     */
    fitTrigger?: boolean
}

type UseFloatingPlacementReturn<T extends HTMLElement> = {
    ref: React.RefCallback<T>
    styles: React.CSSProperties
}

export function useFloatingPlacement<T extends HTMLElement>(
    options: UseFloatingPlacementOptions = {},
): UseFloatingPlacementReturn<T> {
    const { offset = 0, fitTrigger = false } = options

    const { trigger } = useFloatingContext()

    const { reference, floating, x, y } = useFloating({
        middleware: [
            offsetMiddleware(offset),
            sizeMiddleware({
                apply: ({ rects, elements }) => {
                    if (fitTrigger) {
                        Object.assign(elements.floating.style, {
                            width: `${rects.reference.width}px`,
                        })
                    }
                },
            }),
        ],
    })

    useLayoutEffect(() => {
        reference(trigger)
    }, [reference, trigger])

    const styles: React.CSSProperties = {
        position: "absolute",
        left: x ?? 0,
        top: y ?? 0,
    }

    return {
        ref: floating,
        styles,
    }
}
