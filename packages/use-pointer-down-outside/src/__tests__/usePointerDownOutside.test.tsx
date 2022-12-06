import { describe, test, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { usePointerDownOutside } from "../usePointerDownOutside"

describe("usePointerDownOutside", () => {
    test("should execute callback on click outside", async () => {
        const callbackSpy = vi.fn()
        const user = userEvent.setup()

        render(<Wrapper enabled callback={callbackSpy} />)

        expect(callbackSpy).toHaveBeenCalledTimes(0)
        expect(document.activeElement).toBe(document.body)

        await user.tab()

        expect(document.activeElement).toBe(screen.getByTestId("inner"))
        expect(callbackSpy).toHaveBeenCalledTimes(0)

        await user.click(screen.getByText("Outside"))

        expect(document.activeElement).toBe(screen.getByText("Outside"))
        expect(callbackSpy).toHaveBeenCalledTimes(1)
    })

    test("should not execute callback if enabled is false", async () => {
        const callbackSpy = vi.fn()
        const user = userEvent.setup()

        render(<Wrapper enabled={false} callback={callbackSpy} />)

        expect(callbackSpy).toHaveBeenCalledTimes(0)
        expect(document.activeElement).toBe(document.body)

        await user.tab()

        expect(document.activeElement).toBe(screen.getByTestId("inner"))
        expect(callbackSpy).toHaveBeenCalledTimes(0)

        await user.click(screen.getByText("Outside"))

        expect(document.activeElement).toBe(screen.getByText("Outside"))
        expect(callbackSpy).toHaveBeenCalledTimes(0)
    })
})

function Wrapper(props: { enabled: boolean; callback: () => void }) {
    const ref = usePointerDownOutside<HTMLDivElement>(props.enabled, props.callback)

    return (
        <div style={{ pointerEvents: "auto" }}>
            <div ref={ref} tabIndex={0} data-testid="inner">
                <button>Inside</button>
            </div>
            <button>Outside</button>
        </div>
    )
}
