import { Unit } from './convertToUnit';

type PrintSizePreset = {
    name: string
    value: string
    width: number
    height: number
    unit: Unit
}

const PRINT_SIZE_PRESETS: PrintSizePreset[] = [
    {
        name: "A4",
        value: "a4",
        width: 210,
        height: 297,
        unit: "mm"
    },
    {
        name: "A6",
        value: "a6",
        width: 105,
        height: 149,
        unit: "mm"
    },
    {
        name: "Legal",
        value: "legal",
        width: 8.5,
        height: 14,
        unit: "in"
    },
    {
        name: "Letter",
        value: "letter",
        width: 8.5,
        height: 11,
        unit: "in"
    },
    {
        name: "Half Letter",
        value: "half_letter",
        width: 4.25,
        height: 5.5,
        unit: "in"
    },
]

export default PRINT_SIZE_PRESETS;