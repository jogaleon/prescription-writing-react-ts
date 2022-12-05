import ImageData from "./imageData"
import MarkerData from "./markerData"
import MedicineEntryData from "./prescriptionData"
import PrescriptionMarkerData from "./prescriptionMarkerData"
import PrintSettings from "./printSettings"
import TextSettings from "./textSettings"

type ProfileData = {
    id: string
    name: string
    imageData: ImageData | null
    markers: MarkerData[]
    prescriptionList: MedicineEntryData[]
    prescriptionSplitId: string
    prescriptionMarker: PrescriptionMarkerData[]
    textSettings: TextSettings<number> | null
    printSettings: PrintSettings<number> | null
}
export type ProfileDataChunk = {
    id?: string
    name?: string
    imageData?: ImageData | null
    markers?: MarkerData[]
    prescriptionList?: MedicineEntryData[]
    prescriptionSplitId?: string
    prescriptionMarker?: PrescriptionMarkerData[]
    textSettings?: TextSettings<number> | null
    printSettings?: PrintSettings<number> | null
}

export default ProfileData