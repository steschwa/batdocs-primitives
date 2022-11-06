import { describe, test, expect } from "vitest"
import { produceToggleValue } from "../MultiSelect.utils"

describe("produceToggleValue", () => {
    test("should remove value if already included", () => {
        expect(produceToggleValue(["first", "second", "third"], "second")).toMatchObject([
            "first",
            "third",
        ])
    })

    test("should add value if not included", () => {
        expect(produceToggleValue(["first", "third"], "second")).toMatchObject([
            "first",
            "third",
            "second",
        ])
    })
})
