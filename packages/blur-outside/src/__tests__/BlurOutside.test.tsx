import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { BlurOutside } from "../BlurOutside"

describe("BlurOutside", () => {
    test("should detect focus outside", async () => {
        const user = userEvent.setup()
        const onBlurOutsideSpy = vi.fn()

        render(
            <div>
                <BlurOutside onBlurOutside={onBlurOutsideSpy}>
                    <input autoFocus placeholder="Input" />
                </BlurOutside>

                <button>Outside</button>
            </div>,
        )

        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))
        expect(onBlurOutsideSpy).toHaveBeenCalledTimes(0)

        await user.click(screen.getByText("Outside"))
        expect(onBlurOutsideSpy).toHaveBeenCalledTimes(1)
    })
})
