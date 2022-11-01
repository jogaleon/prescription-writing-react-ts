const formatPrescriptionText = (
    medicineName: string,
    dosage: string,
    type: string,
    quantity: string,
    directions: string
): string[] => {
    const firstLine = `${medicineName} (${dosage}/${type}) #${quantity}`;
    const secondLine = `S. ${directions}`
    return [firstLine, secondLine]
}

export default formatPrescriptionText

