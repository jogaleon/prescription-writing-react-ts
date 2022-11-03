const calculateScale = (maxWidth: number, baseWidth: number, decimal: number): number => {
    if (!Number.isInteger(decimal) || decimal < 0) throw new Error("Decimal argument must be a positive integer")
    if (baseWidth <= maxWidth) return 1
    const scale = maxWidth / baseWidth;
    return parseFloat(scale.toFixed(decimal))
}

export default calculateScale
