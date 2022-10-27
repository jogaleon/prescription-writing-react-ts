import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useContext, useEffect, useReducer } from "react";
import { v4 as uuid } from "uuid";

import MARKER_SETTINGS from '../../settings/markerSettings';
import ProfileContext, { ProfileContextType } from '../profile-context/ProfileContext';
import PrescriptionMarkerData, { PrescriptionMarkerDataChunk } from '../../types/state/prescriptionMarkerData';

export type PrescriptionMarkerActionType =
    {type: 'SAVE_PRESCRIPTION_MARKER_POSITION'; payload: {id: string, newX: number, newY: number}} |
    {type: 'SAVE_PRESCRIPTION_MARKER_DIMENSIONS'; payload: {id: string, newW: number, newH: number}} |  
    {type: 'EDIT_PRESCRIPTION_MARKER'; payload: PrescriptionMarkerDataChunk} |
    {type: 'LOAD_PRESCRIPTION_MARKER'; payload: PrescriptionMarkerData} |
    {type: 'RESET_PRESCRIPTION_MARKER'}
;

export type MarkerContextType = {
    prescriptionMarkerState: PrescriptionMarkerData
    prescriptionMarkerDispatch: React.Dispatch<PrescriptionMarkerActionType>
}

//Reducer
const savePrescriptionMarkerPosition = (state: PrescriptionMarkerData, newX: number, newY: number) => {
    return {
        ...state,
        x: newX,
        y: newY
    }
}

const savePrescriptionMarkerDimensions = (state: PrescriptionMarkerData, newW: number, newH: number) => {
    return {
        ...state,
        width: newW,
        height: newH
    }
}

const editPrescriptionMarker = (state: PrescriptionMarkerData, prescriptionMarkerDataChunk: PrescriptionMarkerDataChunk) => {
    return {
        ...state,
        ...prescriptionMarkerDataChunk
    }
}

const loadPrescriptionMarker = (marker: PrescriptionMarkerData) => {
    return marker
}


const resetPrescriptionMarker = (state: PrescriptionMarkerData) => {;
    return {
        ...state,
        x: 0,
        y: 0,
        width: MARKER_SETTINGS.MIN_WIDTH,
        height: MARKER_SETTINGS.MIN_HEIGHT
    }
}

const markersReducer = (state: PrescriptionMarkerData, action: PrescriptionMarkerActionType) => {
    switch(action.type) {
        case 'SAVE_PRESCRIPTION_MARKER_POSITION': return savePrescriptionMarkerPosition(state, action.payload.newX, action.payload.newY)
        case 'SAVE_PRESCRIPTION_MARKER_DIMENSIONS': return savePrescriptionMarkerDimensions(state, action.payload.newW, action.payload.newH)
        case 'EDIT_PRESCRIPTION_MARKER': return editPrescriptionMarker(state, action.payload)
        case 'LOAD_PRESCRIPTION_MARKER': return loadPrescriptionMarker(action.payload)
        case 'RESET_PRESCRIPTION_MARKER': return resetPrescriptionMarker(state)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const PrescriptionMarkerContext = createContext<MarkerContextType | null>(null);
// const initialState = getArrayFromLocalStorage(DATA_KEY) as MarkerData[]
const initialMarkerState: PrescriptionMarkerData = {
    id: '',
    fontSize: '',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    entrySpacing: 0
}

//Context Provider
export const PrescriptionMarkerContextProvider = ({children}: IContextProviderProps) => {
    const {profilesState, activeProfileId} = useContext(ProfileContext) as ProfileContextType;
    const [prescriptionMarkerState, prescriptionMarkerDispatch] = useReducer(markersReducer, initialMarkerState);
    
    // useEffect(() => {
    //     const activeProfile = profilesState.find(profile => profile.id === activeProfileId)
    //     if (!activeProfile?.markers) return
    //     prescriptionMarkerDispatch({type:'LOAD_MARKERS', payload: activeProfile.markers})
    // },[activeProfileId])

    return (
        <PrescriptionMarkerContext.Provider value={{prescriptionMarkerState, prescriptionMarkerDispatch}}>
            {children}
        </PrescriptionMarkerContext.Provider>
    )
}

export default PrescriptionMarkerContext;

