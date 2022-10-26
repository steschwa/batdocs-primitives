import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { useFocusWithin, UseFocusWithinParams } from "../useFocusWithin"

describe("useFocusWithin", () => {
    test("should detect focus within", async () => {
        const onFocusSpy = vi.fn()
        const onBlurSpy = vi.fn()
        const user = userEvent.setup()

        render(<Wrapper onBlur={onBlurSpy} onFocus={onFocusSpy} />)

        expect(screen.queryByText("focus-within")).toBeNull()
        expect(document.activeElement).toBe(document.body)
        expect(onFocusSpy).toHaveBeenCalledTimes(0)
        expect(onBlurSpy).toHaveBeenCalledTimes(0)

        await user.tab()
        screen.getByText("focus-within")
        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))
        expect(onFocusSpy).toHaveBeenCalledTimes(1)
        expect(onBlurSpy).toHaveBeenCalledTimes(0)
        
        await user.tab()
        screen.getByText("focus-within")
        expect(document.activeElement).toBe(screen.getByText("Button"))
        expect(onFocusSpy).toHaveBeenCalledTimes(1)
        expect(onBlurSpy).toHaveBeenCalledTimes(0)

        await user.tab()
        expect(screen.queryByText("focus-within")).toBeNull()
        expect(document.activeElement).toBe(document.body)
        expect(onFocusSpy).toHaveBeenCalledTimes(1)
        expect(onBlurSpy).toHaveBeenCalledTimes(1)
    })
})

function Wrapper(props: UseFocusWithinParams) {
    const { ref, focusWithin } = useFocusWithin(props)

    return (
        <div ref={ref}>
            <input placeholder="Input" />
            <button type="button">Button</button>
            {focusWithin && <span>focus-within</span>}
        </div>
    )
}
