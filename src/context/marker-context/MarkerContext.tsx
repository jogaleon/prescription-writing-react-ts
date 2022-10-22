import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useEffect, useReducer } from "react";
import { v4 as uuid } from "uuid";

import { MarkerData } from '../../types/state/markerData';
import getArrayFromLocalStorage from '../utils/getArrayFromLocalStorage';
import MARKER_SETTINGS from '../../settings/markerSettings';

const DATA_KEY = 'MARKERS';

export type MarkerActionType =
    {type: 'ADD_MARKER'} |
    {type: 'SAVE_POSITION'; payload: {id: string, newX: number, newY: number}} |
    {type: 'SAVE_DIMENSIONS'; payload: {id: string, newW: number, newH?: number}} |
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
        label: 'label',
        text: '',
        fontSize: 12,
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
    return state.map(marker => marker.id !== id ? marker : {
        ...marker,
        width: newW,
        height: (newH) ? newH : marker.height
    })
}

const clearMarkers = () => {
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

const markerReducer = (state: MarkerData[], action: MarkerActionType) => {
    switch(action.type) {
        case 'ADD_MARKER': return addMarker(state)
        case 'SAVE_POSITION': return saveMarkerPosition(state, action.payload.id, action.payload.newX, action.payload.newY)
        case 'SAVE_DIMENSIONS': return saveMarkerDimensions(state, action.payload.id, action.payload.newW)
        case 'CLEAR_MARKERS': return clearMarkers()
        case 'RESET_MARKERS': return resetMarkers(state)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const MarkerContext = createContext<MarkerContextType | null>(null);
const initialState = getArrayFromLocalStorage(DATA_KEY);

//Context Provider
export const MarkerContextProvider = ({children}: IContextProviderProps) => {
    const [markersState, markersDispatch] = useReducer(markerReducer, initialState);
    useEffect(() => {
        localStorage.setItem(DATA_KEY, JSON.stringify(markersState))
    },[markersState])

    return (
        <MarkerContext.Provider value={{markersState, markersDispatch}}>
            {children}
        </MarkerContext.Provider>
    )
}

export default MarkerContext;
