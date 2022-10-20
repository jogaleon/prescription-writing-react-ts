import { IContextProviderProps } from '../types/context/contextProviderProps';
import { createContext, useEffect, useReducer } from "react";
import { v4 as uuid } from "uuid";

import { MarkerData } from '../types/state/markerData';

export type MarkerActionType =
    {type: 'ADD_MARKER'} |
    {type: 'SAVE_POSITION'; payload: {id: string, newX: number, newY: number}} |
    {type: 'SAVE_DIMENSIONS'; payload: {id: string, newW: number, newH?: number}} |
    {type: 'CLEAR_MARKERS'}
;

export type MarkerContextType = {
    markersState: MarkerData[]
    markersDispatch: React.Dispatch<MarkerActionType>
}

//Reducer
const addMarker = (state: MarkerData[]) => {
    return [...state, {
        id: uuid(),
        label: '',
        text: '',
        fontSize: 12,
        x: 0,
        y: 0,
        width: 100,
        height: 12,
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
        w: newW,
        h: (newH) ? newH : marker.height
    })
}

const clearMarkers = () => {
    return []
}

const markerReducer = (state: MarkerData[], action: MarkerActionType) => {
    switch(action.type) {
        case 'ADD_MARKER': return addMarker(state)
        case 'SAVE_POSITION': return saveMarkerPosition(state, action.payload.id, action.payload.newX, action.payload.newY)
        case 'SAVE_DIMENSIONS': return saveMarkerDimensions(state, action.payload.id, action.payload.newW)
        case 'CLEAR_MARKERS': return clearMarkers()
        default: throw new Error(`Invalid dispatch action`)
    }
}

const MarkerContext = createContext<MarkerContextType | null>(null);

//Context Provider
export const MarkerContextProvider = ({children}: IContextProviderProps) => {
    const [markersState, markersDispatch] = useReducer(markerReducer, JSON.parse(localStorage.getItem('markers') || '') || []);
    useEffect(() => {
        localStorage.setItem('markers', JSON.stringify(markersState))
    },[markersState])

    return (
        <MarkerContext.Provider value={{markersState, markersDispatch}}>
            {children}
        </MarkerContext.Provider>
    )
}

export default MarkerContext;

