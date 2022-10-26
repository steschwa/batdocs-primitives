import { useEffect } from "react"
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
        <Floating.Root>
            <Floating.Trigger asChild>
                <button className="border border-solid border-gray-200 p-2">Open floating</button>
            </Floating.Trigger>

            <Floating.Portal>
                <Floating.Content
                    className="flex flex-col gap-y-2 bg-gray-100 p-2"
                    offset={5}
                    style={{ width: "max-content" }}>
                    <div className="flex">
                        <input className="flex-1" placeholder="First name" />
                    </div>
                    <div className="flex">
                        <input className="flex-1" placeholder="Last name" />
                    </div>
                    <div>
                        <button>Save</button>
                    </div>
                </Floating.Content>
            </Floating.Portal>
        </Floating.Root>
    )
}
