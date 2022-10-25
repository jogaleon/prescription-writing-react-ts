import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useContext, useEffect, useReducer } from "react";
import { v4 as uuid } from "uuid";

import TextSettings from '../../types/state/textSettings';
import getArrayFromLocalStorage from '../utils/getArrayFromLocalStorage';
import ProfileContext, { ProfileContextType } from '../profile-context/ProfileContext';
import { convertTypeAcquisitionFromJson } from 'typescript';

export type TextSettingsActionType = 
    {type: 'SAVE_TEXT_SETTINGS' | 'LOAD_TEXT_SETTINGS'; payload: TextSettings}
;

export type TextSettingsContextType = {
    textSettingsState: TextSettings
    textSettingsDispatch: React.Dispatch<TextSettingsActionType>
}

//Reducer
const saveTextSettings = (newTextSettings: TextSettings) => {
    return newTextSettings
}

const textSettingsReducer = (state: TextSettings, action: TextSettingsActionType) => {
    switch(action.type) {
        case 'SAVE_TEXT_SETTINGS': 
        case 'LOAD_TEXT_SETTINGS': return saveTextSettings(action.payload)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const TextSettingsContext = createContext<TextSettingsContextType | null>(null);
const initialState: TextSettings = {
    globalTextSize: '0',
    color: '#000000',
    fontWeight: 'normal'
}

//Context Provider
export const TextSettingsContextProvider = ({children}: IContextProviderProps) => {
    const {profilesState, activeProfileId} = useContext(ProfileContext) as ProfileContextType
    const [textSettingsState, textSettingsDispatch] = useReducer<React.Reducer<TextSettings, TextSettingsActionType>>(textSettingsReducer, initialState)
    
    useEffect(() => {
        const activeProfile = profilesState.find(profile => profile.id === activeProfileId)
        if (!activeProfile?.textSettings) return
        textSettingsDispatch({type: 'LOAD_TEXT_SETTINGS', payload: activeProfile.textSettings})
    },[activeProfileId])

    return (
        <TextSettingsContext.Provider value={{textSettingsState, textSettingsDispatch}}>
            {children}
        </TextSettingsContext.Provider>
    )
}

export default TextSettingsContext;
