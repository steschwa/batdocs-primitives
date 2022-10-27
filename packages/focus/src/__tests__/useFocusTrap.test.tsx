import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup"
import { useCallback, useRef } from "react"
import { beforeEach, describe, expect, test } from "vitest"
import { useFocusTrap, UseFocusTrapOptions } from "../useFocusTrap"

describe("useFocusTrap", () => {
    let user: UserEvent

    beforeEach(() => {
        user = userEvent.setup()
    })

    test("should trap focus", async () => {
        render(<Wrapper />)

        expect(document.activeElement).toBe(document.body)

        await user.tab()
        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))

        await user.tab()
        expect(document.activeElement).toBe(screen.getByText("Button"))

        await user.tab()
        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))

        await user.tab({ shift: true })
        expect(document.activeElement).toBe(screen.getByText("Button"))
    })

    test("should autofocus first focusable children", async () => {
        render(<Wrapper autoFocus />)

        expect(document.activeElement).toBe(document.body)
        await user.click(screen.getByTestId("outer"))

        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))
    })

    test("should restore focus to trigger on blur", async () => {
        render(<TriggerWrapper restoreFocus />)

        expect(document.activeElement).toBe(document.body)
        await user.click(screen.getByText("Click"))

        expect(document.activeElement).toBe(screen.getByTestId("outer"))

        await user.tab()
        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))

        await user.click(document.body)

        expect(document.activeElement).toBe(screen.getByText("Click"))
    })
})

function Wrapper(props: UseFocusTrapOptions) {
    const ref = useFocusTrap(props)

    return (
        <div>
            <div ref={ref} data-testid="outer" tabIndex={-1}>
                <input placeholder="Input" />
                <button type="button">Button</button>
            </div>

            <input placeholder="Outer-Input" />
        </div>
    )
}

function TriggerWrapper(props: UseFocusTrapOptions) {
    const ref = useFocusTrap(props)
    const contentRef = useRef<HTMLElement | null>(null)

    const setRef = useCallback(
        (element: HTMLElement | null) => {
            ref(element)
            contentRef.current = element
        },
        [ref],
    )

    return (
        <div>
            <button
                onClick={() => {
                    contentRef.current?.focus()
                }}>
                Click
            </button>

            <div ref={setRef} data-testid="outer" tabIndex={-1}>
                <input placeholder="Input" />
                <button type="button">Button</button>
            </div>
        </div>
    )
}
