const calculateScale = (maxWidth: number, imageWidth: number, decimal: number): number => {
    if (!Number.isInteger(decimal) || decimal < 0) throw new Error("Decimal argument must be a positive integer")
    if (imageWidth <= maxWidth) return 1
    const scale = maxWidth / imageWidth;
    return parseFloat(scale.toFixed(decimal))
}

export default calculateScale
