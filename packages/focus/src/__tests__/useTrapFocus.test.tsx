import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"
import { useTrapFocus } from "../useTrapFocus"

describe("useTrapFocus", () => {
    test("should contain focus within", async () => {
        const user = userEvent.setup()

        render(<Wrapper />)

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
})

function Wrapper() {
    const { ref, onKeyDown } = useTrapFocus()

    return (
        <div ref={ref} onKeyDown={onKeyDown}>
            <input autoFocus placeholder="Input" />
            <button>Save</button>
        </div>
    )
}
