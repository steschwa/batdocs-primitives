import * as Listbox from "./index"

const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },

    { value: "aubergine", label: "Aubergine" },
    { value: "broccoli", label: "Broccoli" },
    { value: "carrot", label: "Carrot", disabled: true },
    { value: "courgette", label: "Courgette" },
    { value: "leek", label: "Leek" },
]

export const Default = () => (
    <Listbox.Root>
        <Listbox.Content>
            {items.map(item => (
                <Listbox.Item key={item.value} value={item.value} text={item.label}>
                    <Listbox.Indicator asChild>
                        <span style={{ marginRight: "1rem" }}>X</span>
                    </Listbox.Indicator>
                    {item.label}
                </Listbox.Item>
            ))}
        </Listbox.Content>
    </Listbox.Root>
)
