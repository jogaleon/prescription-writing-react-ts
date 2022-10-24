import ImageData from "./imageData"
import MarkerData from "./markerData"
import MedicineEntryData from "./medicineEntryData"
import textSettings from "./textSettings"

type ProfileData = {
    id: string
    name: string
    imageData: ImageData | null
    markers: MarkerData[]
    prescriptionList: MedicineEntryData[]
    textSettings: textSettings
    printWidth: number
    printHeight: number
}
export type ProfileDataChunk = {
    id?: string
    name?: string
    imageData?: ImageData | null
    markers?: MarkerData[]
    prescriptionList?: MedicineEntryData[]
    textSettings?: textSettings
    printWidth?: number
    printHeight?: number
}

export default ProfileData