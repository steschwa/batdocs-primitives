type EventHandler<E> = (event: E) => void

export function composeEventHandlers<E>(...handlers: Array<EventHandler<E> | undefined>) {
    return (event: E) => {
        handlers.forEach(handler => {
            handler?.(event)
        })
    }
}
