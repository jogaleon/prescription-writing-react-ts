const calculateScale = (maxWidth: number, baseWidth: number, decimal: number, scaleDownOnly: boolean): number => {
    if (!Number.isInteger(decimal) || decimal < 0) throw new Error("Decimal argument must be a positive integer")
    if (scaleDownOnly && baseWidth <= maxWidth) return 1
    const scale = maxWidth / baseWidth;
    return parseFloat(scale.toFixed(decimal))
}

export default calculateScale
