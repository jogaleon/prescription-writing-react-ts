type PrescriptionData = {
    id: string
    medicineName: string
    dosage: string
    type: string
    quantity: number
    directions: string
}

export type PrescriptionDataChunk = {
    id?: string
    medicineName?: string
    dosage?: string
    type?: string
    quantity?: number
    directions?: string
}

export default PrescriptionData