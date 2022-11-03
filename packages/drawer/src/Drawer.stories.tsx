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

export const Default = () => {
    useLoadTailwind()

    return (
        <Drawer.Root>
            <Drawer.Trigger asChild>
                <button className="block px-4 h-8 rounded shadow-sm focus:ring-2 ring-offset-2 outline-none bg-gray-100 text-gray-900 ring-blue-400">
                    Open drawer
                </button>
            </Drawer.Trigger>

            <Drawer.Portal>
                <Drawer.Overlay
                    className="fixed inset-0 opacity-20 bg-black data-[open=true]:opacity-1 data-[open=true]:pointer-events-auto data-[open=false]:opacity-0 data-[open=false]:pointer-events-none transition-opacity"
                    forceMount
                />
                <Drawer.Content
                    side="right"
                    forceMount
                    className="fixed top-0 bottom-0 right-0 bg-white p-8 focus:outline-none w-96 data-[open=true]:opacity-1 data-[open=true]:pointer-events-auto data-[open=true]:translate-x-0 data-[open=false]:opacity-0 data-[open=false]:pointer-events-none data-[open=false]:translate-x-full transition-all">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Drawer</h2>

                        <Drawer.Close asChild>
                            <button className="inline-flex items-center justify-center rounded-full h-8 w-8 text-sm bg-red-100 text-red-800">
                                X
                            </button>
                        </Drawer.Close>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
