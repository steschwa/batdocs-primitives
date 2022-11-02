import { describe, test, expect, vi } from "vitest"
import { composeRefs, PossibleRef } from "../composeRefs"

describe("composeRefs", () => {
    test("should pass value to every ref", () => {
        const ref1: PossibleRef<number> = vi.fn()
        const ref2: PossibleRef<number> = {
            current: null,
        }
        const ref3: PossibleRef<number> = undefined

        const setRef = composeRefs(ref1, ref2, ref3)

        expect(ref1).not.toHaveBeenCalled()
        expect(ref2.current).toBeNull()

        setRef(10)

        expect(ref1).toHaveBeenCalledWith(10)
        expect(ref2.current).toBe(10)
    })
})
