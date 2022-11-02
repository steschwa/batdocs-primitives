import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { useFocusOutside, UseFocusOutsideParams } from "../useFocusOutside"

describe("useFocusOutside", () => {
    test("should detect focus outside", async () => {
        const user = userEvent.setup()
        const onBlurOutsideSpy = vi.fn()

        render(<Wrapper onBlurOutside={onBlurOutsideSpy} />)

        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))
        expect(onBlurOutsideSpy).toHaveBeenCalledTimes(0)

        await user.click(screen.getByText("Outside"))
        expect(onBlurOutsideSpy).toHaveBeenCalledTimes(1)
    })
})

function Wrapper(props: UseFocusOutsideParams<HTMLDivElement>) {
    const { ref, onBlur } = useFocusOutside(props)

    return (
        <div>
            <div ref={ref} onBlur={onBlur}>
                <input autoFocus placeholder="Input" />
            </div>

            <button>Outside</button>
        </div>
    )
}
