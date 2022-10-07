import { CollectionItem } from "@steschwa/collection"

export type ItemData = {
    value: string
    text: string
    disabled: boolean
}

export type ListboxCollectionItem = CollectionItem<HTMLDivElement, ItemData>
