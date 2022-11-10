import {
    flip as flipMiddleware,
    offset as offsetMiddleware,
    size as sizeMiddleware,
    useFloating,
} from "@floating-ui/react-dom"
import * as React from "react"

export type UseFloatingPositionOptions = {
    offset?: number
}

export type UseFloatingPositionReturn<T extends HTMLElement> = {
    floating: React.RefCallback<T>
    style: React.CSSProperties
}

export function useFloatingPosition<T extends HTMLElement = HTMLElement>(
    trigger: HTMLElement | null,
    options: UseFloatingPositionOptions = {},
): UseFloatingPositionReturn<T> {
    const { offset = 0 } = options

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

    React.useLayoutEffect(() => {
        reference(trigger)
    }, [reference, trigger])

    const style: React.CSSProperties = React.useMemo(
        () => ({
            position: "absolute",
            left: x ?? 0,
            top: y ?? 0,
        }),
        [x, y],
    )

    return {
        floating,
        style,
    }
}
