import { forwardRef, useEffect } from "react"
import * as Floating from "./index"

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

export const Default = () => {
    useLoadTailwind()

    return (
        <div className="p-20 flex items-center flex-col gap-y-4">
            <button
                className="focus:ring-2"
                onClick={() => {
                    console.log("click")
                }}>
                Outer
            </button>

            <Floating.Root>
                <Floating.Trigger asChild>
                    <FloatingTrigger />
                </Floating.Trigger>

                <Floating.Portal>
                    <Floating.Content
                        className="rounded bg-gray-50 shadow border border-solid border-gray-200 outline-none"
                        offset={5}
                        fitTrigger={false}>
                        <FloatingContent />
                    </Floating.Content>
                </Floating.Portal>
            </Floating.Root>
        </div>
    )
}

export const Multiple = () => {
    useLoadTailwind()

    return (
        <div className="p-20 flex justify-center items-center gap-x-8">
            <Floating.Root>
                <Floating.Trigger asChild>
                    <FloatingTrigger />
                </Floating.Trigger>

                <Floating.Portal>
                    <Floating.Content
                        className="rounded bg-gray-50 shadow border border-solid border-gray-200 outline-none"
                        offset={5}
                        fitTrigger={false}>
                        <FloatingContent />
                    </Floating.Content>
                </Floating.Portal>
            </Floating.Root>

            <Floating.Root>
                <Floating.Trigger asChild>
                    <FloatingTrigger />
                </Floating.Trigger>

                <Floating.Portal>
                    <Floating.Content
                        className="rounded bg-gray-50 shadow border border-solid border-gray-200 outline-none"
                        offset={5}
                        fitTrigger={false}>
                        <FloatingContent />
                    </Floating.Content>
                </Floating.Portal>
            </Floating.Root>

            <Floating.Root>
                <Floating.Trigger asChild>
                    <FloatingTrigger />
                </Floating.Trigger>

                <Floating.Portal>
                    <Floating.Content
                        className="rounded bg-gray-50 shadow border border-solid border-gray-200 outline-none"
                        offset={5}
                        fitTrigger={false}>
                        <FloatingContent />
                    </Floating.Content>
                </Floating.Portal>
            </Floating.Root>
        </div>
    )
}

export const PreventAutofocus = () => {
    useLoadTailwind()

    return (
        <div className="p-20 flex items-center flex-col gap-y-4">
            <Floating.Root>
                <Floating.Trigger asChild>
                    <FloatingTrigger />
                </Floating.Trigger>

                <Floating.Portal>
                    <Floating.Content
                        className="rounded bg-gray-50 shadow border border-solid border-gray-200 outline-none"
                        offset={5}
                        fitTrigger={false}
                        onOpenAutoFocus={event => {
                            event.preventDefault()
                        }}>
                        <FloatingContent />
                    </Floating.Content>
                </Floating.Portal>
            </Floating.Root>
        </div>
    )
}

const FloatingTrigger = forwardRef<HTMLButtonElement, Record<string, unknown>>((props, ref) => {
    return (
        <button
            {...props}
            ref={ref}
            className="block px-4 h-8 rounded shadow-sm focus:ring-2 ring-offset-2 outline-none bg-gray-100 text-gray-900 ring-blue-400">
            Open floating
        </button>
    )
})

function FloatingContent() {
    return (
        <div className="flex flex-col gap-y-4 p-4">
            <fieldset>
                <label htmlFor="first-name" className="text-gray-700 text-sm font-medium">
                    First name
                </label>
                <input
                    id="first-name"
                    placeholder="First name"
                    className="block w-full px-4 h-8 rounded shadow-sm bg-white text-gray-900 placeholder:text-gray-600 border border-solid border-gray-200 focus:ring-2 ring-blue-400 outline-none"
                />
            </fieldset>
            <fieldset>
                <label htmlFor="first-name" className="text-gray-700 text-sm font-medium">
                    Last name
                </label>
                <input
                    id="last-name"
                    placeholder="Last name"
                    className="block w-full px-4 h-8 rounded shadow-sm bg-white text-gray-900 placeholder:text-gray-600 border border-solid border-gray-200 focus:ring-2 ring-blue-400 outline-none"
                />
            </fieldset>

            <hr />

            <button className="block px-4 h-8 rounded shadow-sm focus:ring-2 ring-offset-2 outline-none bg-teal-600 text-white ring-teal-400">
                Save
            </button>
        </div>
    )
}
