import { describe, test, expect, vi } from "vitest"
import { renderHook, act } from "@testing-library/react-hooks"
import { useControllableState } from "../index"

describe("useControllableState", () => {
    test("should use default value as inital value", () => {
        const { result } = renderHook(() => {
            return useControllableState({
                value: undefined,
                defaultValue: 20,
            })
        })

        expect(result.current[0]).toBe(20)
    })

    test("should not change if default value changes", () => {
        const { result, rerender } = renderHook(
            ({ defaultValue }) => {
                return useControllableState({
                    value: undefined,
                    defaultValue,
                })
            },
            {
                initialProps: {
                    defaultValue: 20,
                },
            },
        )

        expect(result.current[0]).toBe(20)

        rerender({ defaultValue: 10 })

        expect(result.current[0]).toBe(20)
    })

    test("should use value", () => {
        const { result, rerender } = renderHook(
            ({ value }) => {
                return useControllableState({
                    value,
                    defaultValue: undefined,
                })
            },
            {
                initialProps: {
                    value: 20,
                },
            },
        )

        expect(result.current[0]).toBe(20)

        rerender({ value: 10 })

        expect(result.current[0]).toBe(10)
    })

    test("should call onChange if state changes controlled", () => {
        const onChangeSpy = vi.fn()

        const { result } = renderHook(() => {
            return useControllableState({
                value: 20,
                defaultValue: undefined,
                onChange: onChangeSpy,
            })
        })

        expect(onChangeSpy).not.toHaveBeenCalled()

        act(() => {
            result.current[1](10)
        })

        expect(onChangeSpy).toHaveBeenCalledWith(10)
    })

    test("should call onChange if state changes uncontrolled", () => {
        const onChangeSpy = vi.fn()

        const { result } = renderHook(() => {
            return useControllableState({
                value: undefined,
                defaultValue: 20,
                onChange: onChangeSpy,
            })
        })

        expect(onChangeSpy).not.toHaveBeenCalled()

        act(() => {
            result.current[1](10)
        })

        expect(onChangeSpy).toHaveBeenCalledWith(10)
    })
})
