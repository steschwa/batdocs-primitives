import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"
import * as MS from "../index"

describe("MultiSelect", () => {
    let user: ReturnType<typeof userEvent.setup>
    beforeEach(() => {
        user = userEvent.setup()
    })

    test("should be able to open content in controlled way", () => {
        const { rerender } = render(
            <MS.Root open={false}>
                <MS.Trigger>Open</MS.Trigger>
                <MS.Content data-testid="content"></MS.Content>
            </MS.Root>,
        )

        expect(screen.queryByTestId("content")).toBeNull()

        rerender(
            <MS.Root open={true}>
                <MS.Trigger>Open</MS.Trigger>
                <MS.Content data-testid="content"></MS.Content>
            </MS.Root>,
        )

        expect(screen.queryByTestId("content")).not.toBeNull()
    })

    test("should notify if open state changes uncontrolled", async () => {
        const onOpenChangeSpy = vi.fn()

        render(
            <MS.Root defaultOpen={false} onOpenChange={onOpenChangeSpy}>
                <MS.Trigger>Open</MS.Trigger>
                <MS.Content data-testid="content"></MS.Content>
            </MS.Root>,
        )

        expect(screen.queryByTestId("content")).toBeNull()
        expect(onOpenChangeSpy).toHaveBeenCalledTimes(0)

        await user.click(screen.getByText("Open"))

        expect(screen.queryByTestId("content")).not.toBeNull()
        expect(onOpenChangeSpy).toHaveBeenCalledTimes(1)
    })

    test("should notify if open state changes controlled", async () => {
        const onOpenChangeSpy = vi.fn()

        render(
            <MS.Root open={false} onOpenChange={onOpenChangeSpy}>
                <MS.Trigger>Open</MS.Trigger>
                <MS.Content data-testid="content"></MS.Content>
            </MS.Root>,
        )

        expect(onOpenChangeSpy).toHaveBeenCalledTimes(0)

        await user.click(screen.getByText("Open"))

        expect(onOpenChangeSpy).toHaveBeenCalledTimes(1)
    })

    test("should open content on trigger click", async () => {
        render(
            <MS.Root defaultOpen={false}>
                <MS.Trigger>Open</MS.Trigger>
                <MS.Content data-testid="content"></MS.Content>
            </MS.Root>,
        )

        expect(screen.queryByTestId("content")).toBeNull()

        await user.click(screen.getByText("Open"))

        expect(screen.queryByTestId("content")).not.toBeNull()
    })

    test("should open content on [Space] down", async () => {
        render(
            <MS.Root defaultOpen={false}>
                <MS.Trigger>Open</MS.Trigger>
                <MS.Content data-testid="content"></MS.Content>
            </MS.Root>,
        )

        expect(screen.queryByTestId("content")).toBeNull()

        screen.getByText("Open").focus()

        expect(document.activeElement).toBe(screen.getByText("Open"))

        await user.keyboard("[Space]")

        expect(screen.queryByTestId("content")).not.toBeNull()
    })

    test("should open content on [Enter] down", async () => {
        render(
            <MS.Root defaultOpen={false}>
                <MS.Trigger>Open</MS.Trigger>
                <MS.Content data-testid="content"></MS.Content>
            </MS.Root>,
        )

        expect(screen.queryByTestId("content")).toBeNull()

        screen.getByText("Open").focus()

        expect(document.activeElement).toBe(screen.getByText("Open"))

        await user.keyboard("[Enter]")

        expect(screen.queryByTestId("content")).not.toBeNull()
    })
})
