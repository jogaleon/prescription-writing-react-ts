import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useContext, useEffect, useReducer } from "react";

import PrintSettings from '../../types/state/printSettings';
import ProfileContext, { ProfileContextType } from '../profile-context/ProfileContext';

export type PrintSettingsActionType = 
    {type: 'SAVE_PRINT_SETTINGS' | 'LOAD_PRINT_SETTINGS'; payload: PrintSettings<number>}
;

export type PrintSettingsContextType = {
    printSettingsState: PrintSettings<number>
    printSettingsDispatch: React.Dispatch<PrintSettingsActionType>
}

//Reducer
const savePrintSettings = (newPrintSettings: PrintSettings<number>) => {
    return newPrintSettings
}

const printSettingsReducer = (state: PrintSettings<number>, action: PrintSettingsActionType) => {
    switch(action.type) {
        case 'SAVE_PRINT_SETTINGS': 
        case 'LOAD_PRINT_SETTINGS': return savePrintSettings(action.payload)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const PrintSettingsContext = createContext<PrintSettingsContextType | null>(null);
const initialState: PrintSettings<number> = {
    preset: 'custom',
    printWidth: 0,
    printHeight: 0,
    unit: 'px',
    orientation: "portrait",
}
//Context Provider
export const PrintSettingsContextProvider = ({children}: IContextProviderProps) => {
    const {profilesState, activeProfileId} = useContext(ProfileContext) as ProfileContextType
    const [printSettingsState, printSettingsDispatch] = useReducer(printSettingsReducer, initialState)
    useEffect(() => {
        const activeProfile = profilesState.find(profile => profile.id === activeProfileId)
        if (!activeProfile?.printSettings) return
        printSettingsDispatch({type: 'LOAD_PRINT_SETTINGS', payload: activeProfile.printSettings})
    },[activeProfileId]);

    return (
        <PrintSettingsContext.Provider value={{printSettingsState, printSettingsDispatch}}>
            {children}
        </PrintSettingsContext.Provider>
    )
}

export default PrintSettingsContext;
