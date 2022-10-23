import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useEffect, useReducer } from "react";
import { v4 as uuid } from "uuid";

import ImageData from '../../types/state/imageData';
import getArrayFromLocalStorage from '../utils/getArrayFromLocalStorage';

export type ImageActionType = 
    {type: 'SAVE_IMAGE_DATA', payload: ImageData}
;

export type ImageContextType = {
    imageState: ImageData
    imageDispatch: React.Dispatch<ImageActionType>
}

//Reducer
const saveImageData = (state: ImageData, newImageData: ImageData) => {
    return newImageData
}

const imageReducer = (state: ImageData, action: ImageActionType) => {
    switch(action.type) {
        case 'SAVE_IMAGE_DATA': return saveImageData(state, action.payload)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const ImageContext = createContext<ImageContextType | null>(null);
const initialState: ImageData = {
    rawData: '',
    nativeWidth: 0,
    nativeHeight: 0,
    scaleFactor: 1,
}

//Context Provider
export const ImageContextProvider = ({children}: IContextProviderProps) => {
    const [imageState, imageDispatch] = useReducer(imageReducer, initialState)
    
    useEffect(() => {
    },[])

    return (
        <ImageContext.Provider value={{imageState, imageDispatch}}>
            {children}
        </ImageContext.Provider>
    )
}

export default ImageContext;

