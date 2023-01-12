import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useContext, useEffect, useReducer } from "react";

import TextSettings from '../../types/state/textSettings';
import ProfileContext, { ProfileContextType } from '../profile-context/ProfileContext';

export type TextSettingsActionType = 
    {type: 'SAVE_TEXT_SETTINGS' | 'LOAD_TEXT_SETTINGS'; payload: TextSettings<number>} | 
    {type: 'EDIT_TEXT_SETTINGS'; payload: Partial<TextSettings<number>>}
;

export type TextSettingsContextType = {
    textSettingsState: TextSettings<number>
    textSettingsDispatch: React.Dispatch<TextSettingsActionType>
}

//Reducer
const saveTextSettings = (newTextSettings: TextSettings<number>) => {
    return newTextSettings
}

const editTextSettings = (state: TextSettings<number>, partialTextSettings: Partial<TextSettings<number>>) => {
    return {
        ...state, 
        ...partialTextSettings
    }
}

const textSettingsReducer = (state: TextSettings<number>, action: TextSettingsActionType) => {
    switch(action.type) {
        case 'SAVE_TEXT_SETTINGS': 
        case 'LOAD_TEXT_SETTINGS': return saveTextSettings(action.payload)
        case 'EDIT_TEXT_SETTINGS': return editTextSettings(state, action.payload)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const TextSettingsContext = createContext<TextSettingsContextType | null>(null);
const initialState: TextSettings<number> = {
    markerGlobalTextSize: 0,
    prescriptionTextSize: 0,
    prescriptionEntrySpacing: 0,
    color: '#000000',
    fontWeight: 'normal'
}

//Context Provider
export const TextSettingsContextProvider = ({children}: IContextProviderProps) => {
    const {profilesState, activeProfileId} = useContext(ProfileContext) as ProfileContextType
    const [textSettingsState, textSettingsDispatch] = useReducer<React.Reducer<TextSettings<number>, TextSettingsActionType>>(textSettingsReducer, initialState)
    // console.log(textSettingsState)
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
