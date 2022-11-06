import { createCollection } from "@batdocs/collection";
import { ItemData } from "./MultiSelect.types";

export const [Collection, useCollection] = createCollection<HTMLDivElement, ItemData>("MultiSelect")
