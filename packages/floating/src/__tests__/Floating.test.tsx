import { render, screen } from "@testing-library/react"
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
