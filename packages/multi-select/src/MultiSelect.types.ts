import { CollectionItem } from "@batdocs/collection"

export type ItemData = {
    value: string
    text: string
}

export type MultiSelectCollectionItem = CollectionItem<HTMLDivElement, ItemData>
