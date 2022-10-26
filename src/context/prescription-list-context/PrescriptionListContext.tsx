import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useContext, useEffect, useReducer } from "react";
import { v4 as uuid } from "uuid";
import PrescriptionData from '../../types/state/prescriptionData';
import ProfileContext, { ProfileContextType } from '../profile-context/ProfileContext';

export type PrescriptionListActionType =
    {type: 'ADD_PRESCRIPTION'} |
    {type: 'EDIT_PRESCRIPTION'} |
    {type: 'DELETE_PRESCRIPTION'; payload: {id: string}} |
    {type: 'LOAD_PRESCRIPTION_LIST'; payload: PrescriptionData[]} |
    {type: 'CLEAR_PRESCRIPTION_LIST'}
;

export type PrescriptionListContextType = {
    prescriptionListState: PrescriptionData[]
    prescriptionListDispatch: React.Dispatch<PrescriptionListActionType>
}

//Reducer
const addPrescription = (state: PrescriptionData[]) => {
    return [...state, {
        id: uuid(),
        medicineName: '',
        dosage: '',
        type: '',
        quantity: 0,
        directions: '',
    }]
}

const deletePrescription = (state: PrescriptionData[], id: string) => {
    return state.filter(marker => marker.id !== id)
}

const loadPrescriptionList = (prescriptionList: PrescriptionData[]) => {
    return prescriptionList
}

const clearPrescriptionList = (): PrescriptionData[] => {
    return []
}

const markersReducer = (state: PrescriptionData[], action: PrescriptionListActionType) => {
    switch(action.type) {
        case 'ADD_PRESCRIPTION': return addPrescription(state)
        case 'DELETE_PRESCRIPTION': return deletePrescription(state, action.payload.id)
        case 'LOAD_PRESCRIPTION_LIST': return loadPrescriptionList(action.payload)
        case 'CLEAR_PRESCRIPTION_LIST': return clearPrescriptionList();
        default: throw new Error(`Invalid dispatch action`)
    }
}

const PrescriptionListContext = createContext<PrescriptionListContextType | null>(null);
// const initialState = getArrayFromLocalStorage(DATA_KEY) as MarkerData[]
const initialState: PrescriptionData[] = []

//Context Provider
export const PrescriptionListContextProvider = ({children}: IContextProviderProps) => {
    const {profilesState, activeProfileId} = useContext(ProfileContext) as ProfileContextType;
    const [prescriptionListState, prescriptionListDispatch] = useReducer(markersReducer, initialState);
    
    useEffect(() => {
        const activeProfile = profilesState.find(profile => profile.id === activeProfileId)
        if (!activeProfile?.prescriptionList) return
        prescriptionListDispatch({type:'LOAD_PRESCRIPTION_LIST', payload: activeProfile.prescriptionList})
    },[activeProfileId])

    return (
        <PrescriptionListContext.Provider value={{prescriptionListState, prescriptionListDispatch}}>
            {children}
        </PrescriptionListContext.Provider>
    )
}

export default PrescriptionListContext;

