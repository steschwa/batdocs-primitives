import React from "react"
import { Slot, SlotProps } from "@radix-ui/react-slot"
import { useComposedRefs } from "@steschwa/compose-refs"

type ObjectType = Record<string, unknown>

export function createCollection<ItemElement extends HTMLElement, ItemData = ObjectType>(
    name: string,
) {
    /* -----------------------------------------------------------------------------------------------
     * CollectionContext
     ** ---------------------------------------------------------------------------------------------*/

    type ContextValue = ContextProps<ItemElement, ItemData>
    const CollectionContext = React.createContext<ContextValue>({
        collectionRef: { current: null },
        items: new Map(),
    })
    const useCollectionContext = () => {
        return React.useContext(CollectionContext)
    }

    /* -----------------------------------------------------------------------------------------------
     * CollectionProvider
     ** ---------------------------------------------------------------------------------------------*/

    const CollectionProvider = (props: CollectionProviderProps) => {
        const { children } = props

        const ref = React.useRef<CollectionElement>(null)
        const items = React.useRef<ContextValue["items"]>(new Map()).current

        return (
            <CollectionContext.Provider value={{ collectionRef: ref, items }}>
                {children}
            </CollectionContext.Provider>
        )
    }
    CollectionProvider.displayName = `${name}CollectionProvider`

    /* -----------------------------------------------------------------------------------------------
     * CollectionSlot
     ** ---------------------------------------------------------------------------------------------*/

    const CollectionSlot = React.forwardRef<CollectionElement, SlotProps>((props, forwardedRef) => {
        const { children } = props

        const { collectionRef } = useCollectionContext()
        const composedRef = useComposedRefs(forwardedRef, collectionRef)

        return <Slot ref={composedRef}>{children}</Slot>
    })
    CollectionSlot.displayName = `${name}CollectionSlot`

    /* -----------------------------------------------------------------------------------------------
     * CollectionItem
     ** ---------------------------------------------------------------------------------------------*/

    const ITEMS_DATA_ATTRIBUTE = "data-grid-list-collection-item"

    const CollectionItemSlot = React.forwardRef<ItemElement, CollectionItemSlotProps<ItemData>>(
        (props, forwardedRef) => {
            const { children, ...itemData } = props

            const ref = React.useRef<ItemElement>(null)
            const composedRef = useComposedRefs(forwardedRef, ref)

            const { items } = useCollectionContext()

            React.useEffect(() => {
                items.set(ref, {
                    ref,
                    ...(itemData as unknown as ItemData),
                })

                return () => {
                    items.delete(ref)
                }
            })

            return (
                <Slot {...{ [ITEMS_DATA_ATTRIBUTE]: "" }} ref={composedRef}>
                    {children}
                </Slot>
            )
        },
    )
    CollectionItemSlot.displayName = `${name}CollectionItemSlot`

    const useCollection = () => {
        const { collectionRef, items } = useCollectionContext()

        const getItems = React.useCallback(() => {
            const collectionNode = collectionRef.current
            if (!collectionNode) {
                return []
            }

            const orderedNodes = Array.from(
                collectionNode.querySelectorAll(`[${ITEMS_DATA_ATTRIBUTE}]`),
            )
            const unorderedItems = Array.from(items.values())

            const orderedItems = unorderedItems.sort((a, b) => {
                const aRef = a.ref.current
                const bRef = b.ref.current

                if (aRef === null && bRef === null) {
                    return 0
                } else if (aRef === null) {
                    return -1
                } else if (bRef === null) {
                    return 1
                }

                return orderedNodes.indexOf(aRef) - orderedNodes.indexOf(bRef)
            })
            return orderedItems
        }, [collectionRef, items])

        return {
            getItems,
        }
    }

    return [
        { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
        useCollection,
    ] as const
}

type CollectionElement = HTMLElement

export type CollectionItem<ItemElement extends HTMLElement, ItemData = ObjectType> = {
    ref: React.RefObject<ItemElement>
} & ItemData

type ContextProps<ItemElement extends HTMLElement, ItemData = ObjectType> = {
    collectionRef: React.RefObject<CollectionElement>
    items: Map<React.RefObject<ItemElement>, CollectionItem<ItemElement, ItemData>>
}

type CollectionProviderProps = {
    children?: React.ReactNode
}

type CollectionItemSlotProps<ItemData = ObjectType> = ItemData & {
    children: React.ReactNode
}
