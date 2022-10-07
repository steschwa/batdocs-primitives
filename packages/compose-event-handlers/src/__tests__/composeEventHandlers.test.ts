import { describe, test, expect, vi } from "vitest"
import { composeEventHandlers } from "../composeEventHandlers"

describe("composeEventHandlers", () => {
    test("should return callable function", () => {
        const handler = composeEventHandlers()

        expect(handler).toBeTypeOf("function")
    })

    test("should call every handler passed", () => {
        const spy1 = vi.fn()
        const spy2 = vi.fn()

        const handler = composeEventHandlers(spy1, spy2)

        expect(spy1).not.toHaveBeenCalled()
        expect(spy2).not.toHaveBeenCalled()

        handler(null)

        expect(spy1).toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
    })

    test("should pass argument to every handler", () => {
        const spy1 = vi.fn()
        const spy2 = vi.fn()

        const handler = composeEventHandlers<number>(spy1, spy2)

        handler(10)

        expect(spy1).toHaveBeenCalledWith(10)
        expect(spy2).toHaveBeenCalledWith(10)
    })
})
