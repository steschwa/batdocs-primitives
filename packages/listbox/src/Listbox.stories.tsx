import { useEffect, useRef, useState } from "react"
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

export const Default = () => (
    <Listbox.Root>
        <Listbox.Content>
            {items.map(item => (
                <Listbox.Item key={item.value} value={item.value} text={item.label}>
                    <Listbox.Indicator asChild>
                        <span style={{ marginRight: "1rem" }}>X</span>
                    </Listbox.Indicator>
                    {item.label}
                </Listbox.Item>
            ))}
        </Listbox.Content>
    </Listbox.Root>
)

export const InDropdown = () => {
    useLoadTailwind()

    const triggerRef = useRef<HTMLButtonElement>(null)
    const [open, setOpen] = useState(false)

    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) {
            return
        }

        setTimeout(() => {
            contentRef.current?.focus({ preventScroll: true })
        })
    }, [open])

    const bounds = triggerRef.current?.getBoundingClientRect()
    const { bottom, left, width } = bounds ?? { bottom: 0, left: 0, width: 0 }

    const transform = `translateX(-${(200 - width) / 2}px)`

    return (
        <div className="flex justify-center" style={{ marginTop: "90vh" }}>
            <button
                ref={triggerRef}
                onClick={() => setOpen(p => !p)}
                className="px-4 h-8 border border-solid border-gray-200 focus:outline-none focus-visible:ring ring-gray-400">
                Select
            </button>

            {open && (
                <Listbox.Root>
                    <Listbox.Content
                        ref={contentRef}
                        className="absolute bg-gray-50 p-2"
                        style={{
                            top: bottom,
                            left,
                            width: 200,
                            transform,
                        }}>
                        {items.map(item => (
                            <Listbox.Item
                                key={item.value}
                                value={item.value}
                                text={item.label}
                                className="px-2 py-1 flex justify-between items-center focus:bg-gray-100 cursor-default focus:outline-none focus-visible:ring-1 ring-blue-400">
                                {item.label}
                                <Listbox.Indicator asChild>
                                    <span style={{ marginRight: "1rem" }}>X</span>
                                </Listbox.Indicator>
                            </Listbox.Item>
                        ))}
                    </Listbox.Content>
                </Listbox.Root>
            )}
        </div>
    )
}
