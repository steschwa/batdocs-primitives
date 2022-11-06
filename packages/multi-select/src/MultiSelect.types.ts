import { CollectionItem } from "@batdocs/collection"

export type ItemData = {
    value: string
    text: string
    disabled: boolean
}

export type MultiSelectCollectionItem = CollectionItem<HTMLDivElement, ItemData>
