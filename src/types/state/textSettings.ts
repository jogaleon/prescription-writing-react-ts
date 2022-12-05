type TextSettings<T extends string | number> = {
    markerGlobalTextSize: T
    prescriptionTextSize: T
    prescriptionEntrySpacing: T
    color: string
    fontWeight: string
}

export default TextSettings