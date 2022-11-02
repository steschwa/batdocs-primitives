import { describe, test, expect } from "vitest"
import { composeStyles } from "../composeStyles"

describe("composeStyles", () => {
    test("should return undefined if all passed params are nullable", () => {
        expect(composeStyles(null, undefined))
    })

    test("should merge stylesheets", () => {
        expect(composeStyles({ width: 100 }, { height: 200 })).toMatchObject({
            width: 100,
            height: 200,
        })
    })

    test("should override earlier stylesheets with later stylesheets", () => {
        expect(composeStyles({ width: 300, height: 500 }, { width: "max-content" })).toMatchObject({
            width: "max-content",
            height: 500,
        })
    })
})
