import MarkerData from "./markerData"
import MedicineEntryData from "./medicineEntryData"

type ProfileData = {
    id: string
    name: string
    imageData: string
    markers: MarkerData[]
    prescriptionList: MedicineEntryData[]
    printSize: {printWidth: number, printHeight: number}
}

export default ProfileData