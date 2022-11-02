import { useEffect } from "react"
import * as Listbox from "./index"

function useLoadTailwind() {
    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://cdn.tailwindcss.com"

        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])
}

const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },

    { value: "aubergine", label: "Aubergine" },
    { value: "broccoli", label: "Broccoli" },
    { value: "carrot", label: "Carrot", disabled: true },
    { value: "courgette", label: "Courgette" },
    { value: "leek", label: "Leek" },
]

export const Default = () => {
    useLoadTailwind()

    return (
        <Listbox.Root>
            <Listbox.Content className="w-96 bg-gray-50 rounded-sm p-2 focus:outline-none flex flex-col gap-y-1">
                {items.map(item => (
                    <Listbox.Item
                        key={item.value}
                        value={item.value}
                        text={item.label}
                        className="rounded focus:bg-blue-50 focus:text-blue-900 focus:outline-none text-gray-700 py-2 pr-4 pl-10 relative cursor-default">
                        <Listbox.Indicator asChild>
                            <div className="absolute left-3 top-0 bottom-0 inline-flex items-center">
                                <div className="rounded-full w-3 h-3 bg-blue-600" />
                            </div>
                        </Listbox.Indicator>
                        {item.label}
                    </Listbox.Item>
                ))}
            </Listbox.Content>
        </Listbox.Root>
    )
}
