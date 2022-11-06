import { useEffect, useState } from "react"
import * as MultiSelect from "./index"

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

const TriggerIcon = () => (
    <MultiSelect.Icon className="text-gray-400">
        <svg
            className="w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
        </svg>
    </MultiSelect.Icon>
)
const Indicator = () => (
    <MultiSelect.Indicator className="absolute left-0 top-0 bottom-0 inline-flex items-center justify-center w-6">
        <svg
            className="w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    </MultiSelect.Indicator>
)

export const Default = () => {
    useLoadTailwind()

    return (
        <MultiSelect.Root>
            <MultiSelect.Trigger className="h-10 px-4 flex justify-between items-center gap-x-3 shadow-sm bg-white rounded border border-solid border-gray-200 focus:outline-none focus:ring-2 ring-offset-2 ring-blue-400 w-64">
                <MultiSelect.Values
                    placeholder="Select fruits and vegetable"
                    className="data-[placeholder=true]:text-gray-400 text-gray-900"
                />

                <TriggerIcon />
            </MultiSelect.Trigger>

            <MultiSelect.Content
                className="bg-white border border-solid border-gray-100 shadow rounded p-1"
                offset={5}>
                {items.map(item => (
                    <MultiSelect.Item
                        key={item.value}
                        value={item.value}
                        text={item.label}
                        className="text-gray-900 py-1 cursor-default rounded-sm px-4 pl-8 relative focus:bg-blue-600 focus:text-white">
                        <Indicator />
                        {item.label}
                    </MultiSelect.Item>
                ))}
            </MultiSelect.Content>
        </MultiSelect.Root>
    )
}

export const CustomValues = () => {
    useLoadTailwind()

    const [values, setValues] = useState<string[]>([])

    const [firstValue, ...restValues] = values

    const getValue = (): string => {
        if (restValues.length === 0) {
            return firstValue
        }

        return `${firstValue} and ${restValues.length} more`
    }

    return (
        <MultiSelect.Root onValuesChange={setValues}>
            <MultiSelect.Trigger className="h-10 px-4 flex justify-between items-center gap-x-3 shadow-sm bg-white rounded border border-solid border-gray-200 focus:outline-none focus:ring-2 ring-offset-2 ring-blue-400 w-64">
                <MultiSelect.Values
                    placeholder="Select fruits and vegetable"
                    className="data-[placeholder=true]:text-gray-400 text-gray-900">
                    {getValue()}
                </MultiSelect.Values>

                <TriggerIcon />
            </MultiSelect.Trigger>

            <MultiSelect.Content
                className="bg-white border border-solid border-gray-100 shadow rounded p-1"
                offset={5}>
                {items.map(item => (
                    <MultiSelect.Item
                        key={item.value}
                        value={item.value}
                        text={item.label}
                        className="text-gray-900 py-1 cursor-default rounded-sm px-4 pl-8 relative focus:bg-blue-600 focus:text-white">
                        <Indicator />
                        {item.label}
                    </MultiSelect.Item>
                ))}
            </MultiSelect.Content>
        </MultiSelect.Root>
    )
}

export const Multiple = () => {
    useLoadTailwind()

    return (
        <div className="flex items-start gap-x-8">
            <MultiSelect.Root>
                <MultiSelect.Trigger className="h-10 px-4 flex justify-between items-center gap-x-3 shadow-sm bg-white rounded border border-solid border-gray-200 focus:outline-none focus:ring-2 ring-offset-2 ring-blue-400 w-64">
                    <MultiSelect.Values
                        placeholder="Select fruits and vegetable"
                        className="data-[placeholder=true]:text-gray-400 text-gray-900"
                    />

                    <TriggerIcon />
                </MultiSelect.Trigger>

                <MultiSelect.Content
                    className="bg-white border border-solid border-gray-100 shadow rounded p-1"
                    offset={5}>
                    {items.map(item => (
                        <MultiSelect.Item
                            key={item.value}
                            value={item.value}
                            text={item.label}
                            className="text-gray-900 py-1 cursor-default rounded-sm px-4 pl-8 relative focus:bg-blue-600 focus:text-white">
                            <Indicator />
                            {item.label}
                        </MultiSelect.Item>
                    ))}
                </MultiSelect.Content>

                <MultiSelect.Root>
                    <MultiSelect.Trigger className="h-10 px-4 flex justify-between items-center gap-x-3 shadow-sm bg-white rounded border border-solid border-gray-200 focus:outline-none focus:ring-2 ring-offset-2 ring-blue-400 w-64">
                        <MultiSelect.Values
                            placeholder="Select fruits and vegetable"
                            className="data-[placeholder=true]:text-gray-400 text-gray-900"
                        />

                        <TriggerIcon />
                    </MultiSelect.Trigger>

                    <MultiSelect.Content
                        className="bg-white border border-solid border-gray-100 shadow rounded p-1"
                        offset={5}>
                        {items.map(item => (
                            <MultiSelect.Item
                                key={item.value}
                                value={item.value}
                                text={item.label}
                                className="text-gray-900 py-1 cursor-default rounded-sm px-4 pl-8 relative focus:bg-blue-600 focus:text-white">
                                <Indicator />
                                {item.label}
                            </MultiSelect.Item>
                        ))}
                    </MultiSelect.Content>
                </MultiSelect.Root>
            </MultiSelect.Root>

            <MultiSelect.Root>
                <MultiSelect.Trigger className="h-10 px-4 flex justify-between items-center gap-x-3 shadow-sm bg-white rounded border border-solid border-gray-200 focus:outline-none focus:ring-2 ring-offset-2 ring-blue-400 w-64">
                    <MultiSelect.Values
                        placeholder="Select fruits and vegetable"
                        className="data-[placeholder=true]:text-gray-400 text-gray-900"
                    />

                    <TriggerIcon />
                </MultiSelect.Trigger>

                <MultiSelect.Content
                    className="bg-white border border-solid border-gray-100 shadow rounded p-1"
                    offset={5}>
                    {items.map(item => (
                        <MultiSelect.Item
                            key={item.value}
                            value={item.value}
                            text={item.label}
                            className="text-gray-900 py-1 cursor-default rounded-sm px-4 pl-8 relative focus:bg-blue-600 focus:text-white">
                            <Indicator />
                            {item.label}
                        </MultiSelect.Item>
                    ))}
                </MultiSelect.Content>
            </MultiSelect.Root>
        </div>
    )
}

export const LongItems = () => {
    useLoadTailwind()

    return (
        <MultiSelect.Root>
            <MultiSelect.Trigger className="h-10 px-4 flex justify-between items-center gap-x-3 shadow-sm bg-white rounded border border-solid border-gray-200 focus:outline-none focus:ring-2 ring-offset-2 ring-blue-400 w-64">
                <MultiSelect.Values
                    placeholder="Select fruits and vegetable"
                    className="data-[placeholder=true]:text-gray-400 text-gray-900"
                />

                <TriggerIcon />
            </MultiSelect.Trigger>

            <MultiSelect.Content
                className="bg-white border border-solid border-gray-100 shadow rounded p-1"
                offset={5}>
                {items.map(item => (
                    <MultiSelect.Item
                        key={item.value}
                        value={item.value}
                        text={item.label}
                        className="text-gray-900 py-1 cursor-default rounded-sm px-4 pl-8 relative focus:bg-blue-600 focus:text-white">
                        <Indicator />
                        {item.label.repeat(4)}
                    </MultiSelect.Item>
                ))}
            </MultiSelect.Content>
        </MultiSelect.Root>
    )
}

export const WithLabel = () => {
    useLoadTailwind()

    return (
        <fieldset>
            <label htmlFor="food">Select a food</label>
            <MultiSelect.Root>
                <MultiSelect.Trigger
                    id="food"
                    className="h-10 px-4 flex justify-between items-center gap-x-3 shadow-sm bg-white rounded border border-solid border-gray-200 focus:outline-none focus:ring-2 ring-offset-2 ring-blue-400 w-64">
                    <MultiSelect.Values
                        placeholder="Select fruits and vegetable"
                        className="data-[placeholder=true]:text-gray-400 text-gray-900"
                    />

                    <TriggerIcon />
                </MultiSelect.Trigger>

                <MultiSelect.Content
                    className="bg-white border border-solid border-gray-100 shadow rounded p-1"
                    offset={5}>
                    {items.map(item => (
                        <MultiSelect.Item
                            key={item.value}
                            value={item.value}
                            text={item.label}
                            className="text-gray-900 py-1 cursor-default rounded-sm px-4 pl-8 relative focus:bg-blue-600 focus:text-white">
                            <Indicator />
                            {item.label}
                        </MultiSelect.Item>
                    ))}
                </MultiSelect.Content>
            </MultiSelect.Root>
        </fieldset>
    )
}

export const Disabled = () => {
    useLoadTailwind()

    return (
        <MultiSelect.Root disabled>
            <MultiSelect.Trigger className="h-10 px-4 flex justify-between items-center gap-x-3 shadow-sm bg-white rounded border border-solid border-gray-200 focus:outline-none focus:ring-2 ring-offset-2 ring-blue-400 w-64 disabled:opacity-50 disabled:cursor-not-allowed">
                <MultiSelect.Values
                    placeholder="Select fruits and vegetable"
                    className="data-[placeholder=true]:text-gray-400 text-gray-900"
                />

                <TriggerIcon />
            </MultiSelect.Trigger>

            <MultiSelect.Content
                className="bg-white border border-solid border-gray-100 shadow rounded p-1"
                offset={5}>
                {items.map(item => (
                    <MultiSelect.Item
                        key={item.value}
                        value={item.value}
                        text={item.label}
                        className="text-gray-900 py-1 cursor-default rounded-sm px-4 pl-8 relative focus:bg-blue-600 focus:text-white">
                        <Indicator />
                        {item.label}
                    </MultiSelect.Item>
                ))}
            </MultiSelect.Content>
        </MultiSelect.Root>
    )
}
