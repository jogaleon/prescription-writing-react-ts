import MarkerData from "./markerData"
import MedicineEntryData from "./medicineEntryData"
import textSettings from "./textSettings"

type ProfileData = {
    id: string
    name: string
    isActive: boolean
    imageData: string
    markers: MarkerData[]
    prescriptionList: MedicineEntryData[]
    textSettings: textSettings
    printWidth: number
    printHeight: number
}

export default ProfileData