import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useEffect, useReducer } from "react";
import { v4 as uuid } from "uuid";

import TextSettings from '../../types/state/textSettings';
import getArrayFromLocalStorage from '../utils/getArrayFromLocalStorage';

export type TextSettingsActionType = 
    {type: 'SAVE_TEXT_SETTINGS'; payload: TextSettings}
;

export type TextSettingsContextType = {
    textSettingsState: TextSettings | null
    textSettingsDispatch: React.Dispatch<TextSettingsActionType>
}

//Reducer
const saveTextSettings = (newTextSettings: TextSettings) => {
    return newTextSettings
}

const textSettingsReducer = (state: TextSettings | null, action: TextSettingsActionType) => {
    switch(action.type) {
        case 'SAVE_TEXT_SETTINGS': return saveTextSettings(action.payload)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const ImageContext = createContext<TextSettingsContextType | null>(null);
const initialState: TextSettings | null = null

//Context Provider
export const ImageContextProvider = ({children}: IContextProviderProps) => {
    const [textSettingsState, textSettingsDispatch] = useReducer<React.Reducer<TextSettings | null, TextSettingsActionType>>(textSettingsReducer, initialState)
    
    useEffect(() => {
    },[])

    return (
        <ImageContext.Provider value={{textSettingsState, textSettingsDispatch}}>
            {children}
        </ImageContext.Provider>
    )
}

export default ImageContext;
export {}
