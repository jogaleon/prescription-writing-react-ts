import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useContext, useEffect, useReducer } from "react";
import { v4 as uuid } from 'uuid';

import MARKER_SETTINGS from '../../settings/markerSettings';
import ProfileContext, { ProfileContextType } from '../profile-context/ProfileContext';
import PrescriptionMarkerData from '../../types/state/prescriptionMarkerData';

export type PrescriptionMarkerActionType =
    {type: 'SAVE_PRESCRIPTION_MARKER_POSITION'; payload: {id: string, newX: number, newY: number}} |
    {type: 'SAVE_PRESCRIPTION_MARKER_DIMENSIONS'; payload: {id: string, newW: number, newH: number}} |  
    {type: 'EDIT_PRESCRIPTION_MARKER'; payload: {id: string, prescriptionMarkerDataChunk: Partial<PrescriptionMarkerData>}} |
    {type: 'LOAD_PRESCRIPTION_MARKERS'; payload: PrescriptionMarkerData[]} |
    {type: 'RESET_PRESCRIPTION_MARKERS'}
;

export type PrescriptionMarkerContextType = {
    prescriptionMarkersState: PrescriptionMarkerData[]
    prescriptionMarkersDispatch: React.Dispatch<PrescriptionMarkerActionType>
}

//Reducer
const savePrescriptionMarkerPosition = (state: PrescriptionMarkerData[], id: string, newX: number, newY: number) => {
    return state.map(marker => (marker.id !== id) ? marker : {
        ...marker,
        x: newX,
        y: newY
    })
}

const savePrescriptionMarkerDimensions = (state: PrescriptionMarkerData[], id: string, newW: number, newH: number) => {
    return state.map(marker => (marker.id !== id) ? marker : {
        ...marker,
        width: newW,
        height: newH
    })
}

const editPrescriptionMarker = (state: PrescriptionMarkerData[], id: string, prescriptionMarkerDataChunk: Partial<PrescriptionMarkerData>) => {
    return state.map(marker => (marker.id !== id) ? marker : {
        ...marker,
        ...prescriptionMarkerDataChunk
    })
}

const loadPrescriptionMarkers = (markers: PrescriptionMarkerData[]) => {
    return markers
}


const resetPrescriptionMarkers = (state: PrescriptionMarkerData[]) => {
    return state.map(marker => ({
        ...marker,
        x: 0,
        y: 0,
        width: MARKER_SETTINGS.MIN_WIDTH,
        height: MARKER_SETTINGS.MIN_HEIGHT
    }))
}

const prescriptionMarkerReducer = (state: PrescriptionMarkerData[], action: PrescriptionMarkerActionType) => {
    switch(action.type) {
        case 'SAVE_PRESCRIPTION_MARKER_POSITION': return savePrescriptionMarkerPosition(state, action.payload.id, action.payload.newX, action.payload.newY)
        case 'SAVE_PRESCRIPTION_MARKER_DIMENSIONS': return savePrescriptionMarkerDimensions(state, action.payload.id, action.payload.newW, action.payload.newH)
        case 'EDIT_PRESCRIPTION_MARKER': return editPrescriptionMarker(state, action.payload.id, action.payload.prescriptionMarkerDataChunk)
        case 'LOAD_PRESCRIPTION_MARKERS': return loadPrescriptionMarkers(action.payload)
        case 'RESET_PRESCRIPTION_MARKERS': return resetPrescriptionMarkers(state)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const PrescriptionMarkerContext = createContext<PrescriptionMarkerContextType | null>(null);
const initialMarkerState: PrescriptionMarkerData[] = []

//Context Provider
export const PrescriptionMarkerContextProvider = ({children}: IContextProviderProps) => {
    const {profilesState, activeProfileId} = useContext(ProfileContext) as ProfileContextType;
    const [prescriptionMarkersState, prescriptionMarkersDispatch] = useReducer(prescriptionMarkerReducer, initialMarkerState);

    useEffect(() => {
        const activeProfile = profilesState.find(profile => profile.id === activeProfileId);
        if (!activeProfile?.prescriptionMarker) return
        prescriptionMarkersDispatch({type:'LOAD_PRESCRIPTION_MARKERS', payload: activeProfile.prescriptionMarker})
    },[activeProfileId])

    return (
        <PrescriptionMarkerContext.Provider value={{prescriptionMarkersState, prescriptionMarkersDispatch}}>
            {children}
        </PrescriptionMarkerContext.Provider>
    )
}

export default PrescriptionMarkerContext;

