import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useContext, useEffect, useReducer } from "react";
import { v4 as uuid } from "uuid";

import MarkerData from '../../types/state/markerData';
import MARKER_SETTINGS from '../../settings/markerSettings';
import TEXT_SETTINGS from '../../settings/textSettings';
import ProfileContext, { ProfileContextType } from '../profile-context/ProfileContext';

export type MarkerActionType =
    {type: 'ADD_MARKER'} |
    {type: 'SAVE_MARKER_POSITION'; payload: {id: string, newX: number, newY: number}} |
    {type: 'SAVE_MARKER_DIMENSIONS'; payload: {id: string, newW: number, newH?: number}} |  
    {type: 'EDIT_MARKER'; payload: {id: string, label: string, text: string, textSize: string}} |
    {type: 'DELETE_MARKER'; payload: {id: string}} |
    {type: 'LOAD_MARKERS'; payload: MarkerData[]} |
    {type: 'CLEAR_MARKERS'} |
    {type: 'RESET_MARKERS'}
;

export type MarkerContextType = {
    markersState: MarkerData[]
    markersDispatch: React.Dispatch<MarkerActionType>
}

//Reducer
const addMarker = (state: MarkerData[]) => {
    return [...state, {
        id: uuid(),
        label: `Marker${state.length + 1}`,
        text: '',
        textSize: TEXT_SETTINGS.DEFAULT_MARKER_TEXT_SIZE,
        x: 0,
        y: 0,
        width: 100,
        height: 50,
    }]
}

const saveMarkerPosition = (state: MarkerData[], id: string, newX: number, newY: number) => {
    return state.map(marker => marker.id !== id ? marker : {
        ...marker,
        x: newX,
        y: newY
    })
}

const saveMarkerDimensions = (state: MarkerData[], id: string, newW: number, newH?: number) => {
    return state.map(marker => (marker.id !== id) ? marker : {
        ...marker,
        width: newW,
        height: (newH) ? newH : marker.height
    })
}

const editMarker = (state: MarkerData[], id: string, newLabel: string, newText: string, newTextSize: string) => {
    return state.map(marker => (marker.id !== id) ? marker : {
        ...marker,
        label: newLabel,
        text: newText,
        textSize: newTextSize
    })
}

const deleteMarker = (state: MarkerData[], id: string) => {
    return state.filter(marker => marker.id !== id)
}

const loadMarkers = (markers: MarkerData[]) => {
    return markers
}

const clearMarkers = (): MarkerData[] => {
    return []
}

const resetMarkers = (state: MarkerData[]) => {;
    return state.map(marker => ({
        ...marker,
        x: 0,
        y: 0,
        width: MARKER_SETTINGS.MIN_WIDTH
    }))
}

const markersReducer = (state: MarkerData[], action: MarkerActionType) => {
    switch(action.type) {
        case 'ADD_MARKER': return addMarker(state)
        case 'SAVE_MARKER_POSITION': return saveMarkerPosition(state, action.payload.id, action.payload.newX, action.payload.newY)
        case 'SAVE_MARKER_DIMENSIONS': return saveMarkerDimensions(state, action.payload.id, action.payload.newW)
        case 'EDIT_MARKER': return editMarker(state, action.payload.id, action.payload.label, action.payload.text, action.payload.textSize)
        case 'DELETE_MARKER': return deleteMarker(state, action.payload.id)
        case 'LOAD_MARKERS': return loadMarkers(action.payload)
        case 'CLEAR_MARKERS': return clearMarkers()
        case 'RESET_MARKERS': return resetMarkers(state)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const MarkerContext = createContext<MarkerContextType | null>(null);
const initialMarkerState: MarkerData[] = []

//Context Provider
export const MarkerContextProvider = ({children}: IContextProviderProps) => {
    const {profilesState, activeProfileId} = useContext(ProfileContext) as ProfileContextType;
    const [markersState, markersDispatch] = useReducer(markersReducer, initialMarkerState);

    useEffect(() => {
        const activeProfile = profilesState.find(profile => profile.id === activeProfileId)
        if (!activeProfile?.markers) return
        markersDispatch({type:'LOAD_MARKERS', payload: activeProfile.markers})
    },[activeProfileId])

    return (
        <MarkerContext.Provider value={{markersState, markersDispatch}}>
            {children}
        </MarkerContext.Provider>
    )
}

export default MarkerContext;

