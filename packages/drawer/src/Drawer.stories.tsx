import { useEffect } from "react"
import * as Drawer from "./index"

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

const Trigger = () => (
    <Drawer.Trigger asChild>
        <button className="block px-4 h-8 rounded shadow-sm focus:ring-2 ring-offset-2 outline-none bg-gray-100 text-gray-900 ring-blue-400">
            Open drawer
        </button>
    </Drawer.Trigger>
)
const Close = () => (
    <Drawer.Close asChild>
        <button className="inline-flex items-center justify-center rounded-full h-10 w-10 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 ring-offset-2 ring-gray-400">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </button>
    </Drawer.Close>
)
const Overlay = () => (
    <Drawer.Overlay
        className="fixed inset-0 opacity-20 bg-black data-[open=true]:opacity-1 data-[open=true]:pointer-events-auto data-[open=false]:opacity-0 data-[open=false]:pointer-events-none transition-opacity"
        forceMount
    />
)

export const Right = () => {
    useLoadTailwind()

    return (
        <Drawer.Root>
            <Trigger />

            <Drawer.Portal>
                <Overlay />
                <Drawer.Content
                    forceMount
                    className="fixed top-0 bottom-0 right-0 bg-white p-8 focus:outline-none w-96 data-[open=true]:opacity-1 data-[open=true]:pointer-events-auto data-[open=true]:translate-x-0 data-[open=false]:opacity-0 data-[open=false]:pointer-events-none data-[open=false]:translate-x-full transition-all">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Drawer</h2>

                        <Close />
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}

export const Left = () => {
    useLoadTailwind()

    return (
        <Drawer.Root>
            <Trigger />

            <Drawer.Portal>
                <Overlay />
                <Drawer.Content
                    forceMount
                    className="fixed top-0 bottom-0 left-0 bg-white p-8 focus:outline-none w-96 data-[open=true]:opacity-1 data-[open=true]:pointer-events-auto data-[open=true]:translate-x-0 data-[open=false]:opacity-0 data-[open=false]:pointer-events-none data-[open=false]:-translate-x-full transition-all">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Drawer</h2>

                        <Close />
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}

export const Bottom = () => {
    useLoadTailwind()

    return (
        <Drawer.Root>
            <Trigger />

            <Drawer.Portal>
                <Overlay />
                <Drawer.Content
                    forceMount
                    className="fixed bottom-0 left-0 right-0 bg-white p-8 focus:outline-none h-96 data-[open=true]:opacity-1 data-[open=true]:pointer-events-auto data-[open=true]:translate-y-0 data-[open=false]:opacity-0 data-[open=false]:pointer-events-none data-[open=false]:translate-y-full transition-all">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Drawer</h2>

                        <Close />
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
