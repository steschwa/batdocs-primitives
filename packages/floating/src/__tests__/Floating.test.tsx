import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import * as Floating from "../index"

describe("Floating", () => {
    test("should use child as trigger", () => {
        render(
            <Floating.Root>
                <Floating.Trigger asChild>
                    <button data-testid="child-trigger">Trigger</button>
                </Floating.Trigger>
                <Floating.Content></Floating.Content>
            </Floating.Root>,
        )

        screen.getByTestId("child-trigger")
    })

    test("should not show content by default", async () => {
        render(
            <Floating.Root>
                <Floating.Trigger />
                <Floating.Content>Inside Content</Floating.Content>
            </Floating.Root>,
        )
    })
})

describe("Floating.open", () => {
    test("should be able to use component in uncontrolled mode", () => {
        render(
            <Floating.Root defaultOpen>
                <Floating.Trigger asChild>
                    <button data-testid="child-trigger">Trigger</button>
                </Floating.Trigger>
                <Floating.Content>Inside Content</Floating.Content>
            </Floating.Root>,
        )

        screen.getByText("Inside Content")
    })

    test("should be able to use component in controlled mode", () => {
        const { rerender } = render(
            <Floating.Root open>
                <Floating.Trigger />
                <Floating.Content>Inside Content</Floating.Content>
            </Floating.Root>,
        )

        screen.getByText("Inside Content")

        rerender(
            <Floating.Root open={false}>
                <Floating.Trigger />
                <Floating.Content>Inside Content</Floating.Content>
            </Floating.Root>,
        )

        expect(screen.queryByText("Inside Content")).toBeNull()
    })

    test("should notify about open state changes", async () => {
        const onOpenChangeSpy = vi.fn()
        const user = userEvent.setup()

        render(
            <Floating.Root onOpenChange={onOpenChangeSpy}>
                <Floating.Trigger asChild>
                    <button>Trigger</button>
                </Floating.Trigger>
                <Floating.Content>Inside Content</Floating.Content>
            </Floating.Root>,
        )

        expect(screen.queryByText("Inside Content")).toBeNull()
        expect(onOpenChangeSpy).not.toHaveBeenCalled()

        await user.click(screen.getByText("Trigger"))

        screen.getByText("Inside Content")
        expect(onOpenChangeSpy).toHaveBeenCalledWith(true)
    })
})

describe("Floating.onOpenAutoFocus", () => {
    test("should call onOpenAutoFocus if content becomes open", async () => {
        const user = userEvent.setup()
        const onOpenAutoFocusSpy = vi.fn()

        render(
            <Floating.Root>
                <Floating.Trigger asChild>
                    <button>Trigger</button>
                </Floating.Trigger>
                <Floating.Content data-testid="content" onOpenAutoFocus={onOpenAutoFocusSpy}>
                    Inside Content
                </Floating.Content>
            </Floating.Root>,
        )

        expect(document.activeElement).toBe(document.body)
        expect(onOpenAutoFocusSpy).not.toHaveBeenCalled()

        await user.click(screen.getByText("Trigger"))

        await waitFor(() => {
            expect(onOpenAutoFocusSpy).toHaveBeenCalled()
        })

        expect(document.activeElement).toBe(screen.getByTestId("content"))
    })

    test("should focus first focusable children if content becomes open", async () => {
        const user = userEvent.setup()

        render(
            <Floating.Root>
                <Floating.Trigger asChild>
                    <button>Trigger</button>
                </Floating.Trigger>
                <Floating.Content data-testid="content">
                    <input placeholder="Input" />
                </Floating.Content>
            </Floating.Root>,
        )

        expect(document.activeElement).toBe(document.body)

        await user.click(screen.getByText("Trigger"))

        await waitFor(() => {
            expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))
        })
    })

    test("should focus content if onOpenAutoFocus event is prevented", async () => {
        const user = userEvent.setup()
        const onOpenAutoFocusSpy = vi.fn((event: Event) => {
            event.preventDefault()
        })

        render(
            <Floating.Root>
                <Floating.Trigger asChild>
                    <button>Trigger</button>
                </Floating.Trigger>
                <Floating.Content data-testid="content" onOpenAutoFocus={onOpenAutoFocusSpy}>
                    <input placeholder="Input" />
                </Floating.Content>
            </Floating.Root>,
        )

        expect(document.activeElement).toBe(document.body)
        expect(onOpenAutoFocusSpy).not.toHaveBeenCalled()

        await user.click(screen.getByText("Trigger"))

        await waitFor(() => {
            expect(onOpenAutoFocusSpy).toHaveBeenCalled()
        })

        expect(document.activeElement).toBe(screen.getByTestId("content"))
    })
})

describe("Floating.onCloseAutoFocus", () => {
    test("should call onCloseAutoFocus if content becomes closed", () => {
        const onCloseAutoFocusSpy = vi.fn()

        const { rerender } = render(
            <Floating.Root open={true}>
                <Floating.Trigger asChild>
                    <button>Trigger</button>
                </Floating.Trigger>
                <Floating.Content data-testid="content" onCloseAutoFocus={onCloseAutoFocusSpy}>
                    Inside Content
                </Floating.Content>
            </Floating.Root>,
        )

        expect(document.activeElement).toBe(document.body)
        expect(onCloseAutoFocusSpy).not.toHaveBeenCalled()

        rerender(
            <Floating.Root open={false}>
                <Floating.Trigger asChild>
                    <button>Trigger</button>
                </Floating.Trigger>
                <Floating.Content data-testid="content" onCloseAutoFocus={onCloseAutoFocusSpy}>
                    Inside Content
                </Floating.Content>
            </Floating.Root>,
        )

        expect(onCloseAutoFocusSpy).toHaveBeenCalled()

        expect(document.activeElement).toBe(screen.getByText("Trigger"))
    })

    test("should not focus trigger if onCloseAutoFocus event is prevented", () => {
        const onCloseAutoFocusSpy = vi.fn((event: Event) => {
            event.preventDefault()
        })

        const { rerender } = render(
            <Floating.Root open={true}>
                <Floating.Trigger asChild>
                    <button>Trigger</button>
                </Floating.Trigger>
                <Floating.Content data-testid="content" onCloseAutoFocus={onCloseAutoFocusSpy}>
                    Inside Content
                </Floating.Content>
            </Floating.Root>,
        )

        expect(document.activeElement).toBe(document.body)
        expect(onCloseAutoFocusSpy).not.toHaveBeenCalled()

        rerender(
            <Floating.Root open={false}>
                <Floating.Trigger asChild>
                    <button>Trigger</button>
                </Floating.Trigger>
                <Floating.Content data-testid="content" onCloseAutoFocus={onCloseAutoFocusSpy}>
                    Inside Content
                </Floating.Content>
            </Floating.Root>,
        )

        expect(onCloseAutoFocusSpy).toHaveBeenCalled()

        expect(document.activeElement).not.toBe(screen.getByText("Trigger"))
    })
})

describe("Floating.onEscapeKeyDown", () => {
    test("should call onEscapeKeyDown if Escape is used inside content", async () => {
        const onEscapeKeyDownSpy = vi.fn()
        const user = userEvent.setup()

        render(
            <Floating.Root defaultOpen>
                <Floating.Trigger asChild>
                    <button>Trigger</button>
                </Floating.Trigger>
                <Floating.Content data-testid="content" onEscapeKeyDown={onEscapeKeyDownSpy}>
                    <input autoFocus placeholder="Input" />
                </Floating.Content>
            </Floating.Root>,
        )

        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))
        expect(onEscapeKeyDownSpy).not.toHaveBeenCalled()

        await user.keyboard("[Escape]")

        expect(onEscapeKeyDownSpy).toHaveBeenCalled()

        await waitFor(() => {
            expect(screen.queryByTestId("content")).toBeNull()
        })
    })

    test("should not close content if onEscapeKeyDown event is prevented", async () => {
        const onEscapeKeyDownSpy = vi.fn((event: React.KeyboardEvent) => {
            event.preventDefault()
        })
        const user = userEvent.setup()

        render(
            <Floating.Root defaultOpen>
                <Floating.Trigger asChild>
                    <button>Trigger</button>
                </Floating.Trigger>
                <Floating.Content data-testid="content" onEscapeKeyDown={onEscapeKeyDownSpy}>
                    <input autoFocus placeholder="Input" />
                </Floating.Content>
            </Floating.Root>,
        )

        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))
        expect(onEscapeKeyDownSpy).not.toHaveBeenCalled()

        await user.keyboard("[Escape]")

        expect(onEscapeKeyDownSpy).toHaveBeenCalled()

        await waitFor(() => {
            expect(screen.queryByTestId("content")).not.toBeNull()
        })
    })
})

describe("Floating.trapFocus", () => {
    test("should trap focus witin content", async () => {
        const user = userEvent.setup()

        render(
            <Floating.Root defaultOpen>
                <Floating.Trigger asChild>
                    <button>Trigger</button>
                </Floating.Trigger>
                <Floating.Content>
                    <input placeholder="Input" />
                    <button>Save</button>
                </Floating.Content>
            </Floating.Root>,
        )

        await waitFor(() => {
            expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))
        })

        await user.tab()
        expect(document.activeElement).toBe(screen.getByText("Save"))

        await user.tab()
        expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))

        await user.tab({ shift: true })
        expect(document.activeElement).toBe(screen.getByText("Save"))
    })
})

describe("Floating.onBlurOutside", () => {
    test("should close content if focus moves outside", async () => {
        const onBlurOutsideSpy = vi.fn()
        const user = userEvent.setup()

        render(
            <div>
                <button>Outside</button>
                <Floating.Root defaultOpen>
                    <Floating.Trigger asChild>
                        <button>Trigger</button>
                    </Floating.Trigger>
                    <Floating.Content data-testid="content" onBlurOutside={onBlurOutsideSpy}>
                        <input placeholder="Input" />
                    </Floating.Content>
                </Floating.Root>
                ,
            </div>,
        )

        expect(onBlurOutsideSpy).not.toHaveBeenCalled()

        await waitFor(() => {
            expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))
        })

        await user.click(screen.getByText("Outside"))

        expect(screen.queryByTestId("content")).toBeNull()
        expect(onBlurOutsideSpy).toHaveBeenCalledTimes(1)
    })

    test("should not close content if onBlurOutside event is prevented", async () => {
        const onBlurOutsideSpy = vi.fn((event: React.FocusEvent) => {
            event.preventDefault()
        })
        const user = userEvent.setup()

        render(
            <div>
                <button>Outside</button>
                <Floating.Root defaultOpen>
                    <Floating.Trigger asChild>
                        <button>Trigger</button>
                    </Floating.Trigger>
                    <Floating.Content data-testid="content" onBlurOutside={onBlurOutsideSpy}>
                        <input placeholder="Input" />
                    </Floating.Content>
                </Floating.Root>
            </div>,
        )

        expect(onBlurOutsideSpy).not.toHaveBeenCalled()

        await waitFor(() => {
            expect(document.activeElement).toBe(screen.getByPlaceholderText("Input"))
        })

        await user.click(screen.getByText("Outside"))

        expect(screen.queryByTestId("content")).not.toBeNull()
        expect(onBlurOutsideSpy).toHaveBeenCalledTimes(1)
    })
})
