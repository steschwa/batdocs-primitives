import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"
import { FocusTrap } from "../FocusTrap"

describe("FocusTrap", () => {
    test("should contain focus within", async () => {
        const user = userEvent.setup()

        render(
            <FocusTrap asChild>
                <div>
                    <input autoFocus placeholder="Input" />
                    <button>Save</button>
                </div>
            </FocusTrap>,
        )

        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))

        await user.tab()
        expect(document.activeElement).toBe(screen.getByText("Save"))

        await user.tab()
        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))

        await user.tab({ shift: true })
        expect(document.activeElement).toBe(screen.getByText("Save"))

        await user.tab({ shift: true })
        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))
    })

    test("should call preventDefault on event if there are not focusable children", async () => {
        const user = userEvent.setup()

        render(<FocusTrap data-testid="wrapper" />)

        screen.getByTestId("wrapper").focus()

        expect(document.activeElement).toBe(screen.getByTestId("wrapper"))

        await user.tab()
        expect(document.activeElement).toBe(screen.getByTestId("wrapper"))
    })
})
