import * as React from "react"
import { useCollection } from "./MultiSelect.collection"

export function useEnabledItems() {
    const { getItems } = useCollection()

    const getEnabledItems = React.useCallback(() => {
        return getItems().filter(item => !item.disabled)
    }, [getItems])

    return getEnabledItems
}
