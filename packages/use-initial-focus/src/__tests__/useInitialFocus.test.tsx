import { describe, test, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { useInitialFocus } from "../useInitialFocus"

describe("useInitialFocus", () => {
    test("should focus element if enabled", () => {
        const callbackSpy = vi.fn()

        const { rerender } = render(<Wrapper enabled={false} callback={callbackSpy} />)

        expect(document.activeElement).toBe(document.body)
        expect(callbackSpy).toHaveBeenCalledTimes(0)

        callbackSpy.mockReturnValueOnce(screen.getByText("Second"))

        rerender(<Wrapper enabled callback={callbackSpy} />)

        expect(document.activeElement).toBe(screen.getByText("Second"))
        expect(callbackSpy).toHaveBeenCalledTimes(1)
    })

    test("should not execute callback if enabled is false", () => {
        const callbackSpy = vi.fn()

        const { rerender } = render(<Wrapper enabled={false} callback={callbackSpy} />)

        expect(document.activeElement).toBe(document.body)
        expect(callbackSpy).toHaveBeenCalledTimes(0)

        callbackSpy.mockReturnValueOnce(screen.getByText("Second"))

        rerender(<Wrapper enabled={false} callback={callbackSpy} />)

        expect(callbackSpy).toHaveBeenCalledTimes(0)
    })
})

function Wrapper(props: { enabled: boolean; callback: () => HTMLElement | null }) {
    useInitialFocus(props.enabled, props.callback)

    return (
        <div>
            <button>First</button>
            <button>Second</button>
            <button>Third</button>
        </div>
    )
}
