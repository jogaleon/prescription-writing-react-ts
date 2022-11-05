import ImageData from "./imageData"
import MarkerData from "./markerData"
import MedicineEntryData from "./prescriptionData"
import PrescriptionMarkerData from "./prescriptionMarkerData"
import TextSettings from "./textSettings"

type ProfileData = {
    id: string
    name: string
    imageData: ImageData | null
    markers: MarkerData[]
    prescriptionList: MedicineEntryData[]
    prescriptionMarker: PrescriptionMarkerData[]
    textSettings: TextSettings | null
    printWidth: number
    printHeight: number
}
export type ProfileDataChunk = {
    id?: string
    name?: string
    imageData?: ImageData | null
    markers?: MarkerData[]
    prescriptionList?: MedicineEntryData[]
    prescriptionMarker?: PrescriptionMarkerData[]
    textSettings?: TextSettings | null
    printWidth?: number
    printHeight?: number
}

export default ProfileData