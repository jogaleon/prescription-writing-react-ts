import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useContext, useEffect, useReducer } from "react";
import { v4 as uuid } from "uuid";

import ImageData from '../../types/state/imageData';
import getArrayFromLocalStorage from '../utils/getArrayFromLocalStorage';
import ProfileContext, { ProfileContextType } from '../profile-context/ProfileContext';

export type ImageActionType = 
    {type: 'SAVE_IMAGE_DATA' | 'LOAD_IMAGE_DATA', payload: ImageData | null}
;

export type ImageContextType = {
    imageState: ImageData | null
    imageDispatch: React.Dispatch<ImageActionType>
}

//Reducer
const saveImageData = (newImageData: ImageData | null) => {
    return newImageData
}

const imageReducer = (state: ImageData | null, action: ImageActionType) => {
    switch(action.type) {
        case 'SAVE_IMAGE_DATA': 
        case 'LOAD_IMAGE_DATA': return saveImageData(action.payload)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const ImageContext = createContext<ImageContextType | null>(null);
const initialState: ImageData | null = null

//Context Provider
export const ImageContextProvider = ({children}: IContextProviderProps) => {
    const {profilesState, activeProfileId} = useContext(ProfileContext) as ProfileContextType;
    const [imageState, imageDispatch] = useReducer<React.Reducer<ImageData | null, ImageActionType>>(imageReducer, initialState)
    
    useEffect(() => {
        const activeProfile = profilesState.find(profile => profile.id === activeProfileId)
        if (!activeProfile) return
        imageDispatch({type: 'LOAD_IMAGE_DATA', payload: activeProfile.imageData})
    },[activeProfileId])

    return (
        <ImageContext.Provider value={{imageState, imageDispatch}}>
            {children}
        </ImageContext.Provider>
    )
}

export default ImageContext;

