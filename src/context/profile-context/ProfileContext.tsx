import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useEffect, useReducer } from "react";
import { v4 as uuid } from "uuid";

import ProfileData from '../../types/state/profileData';
import getArrayFromLocalStorage from '../utils/getArrayFromLocalStorage';
import MARKER_SETTINGS from '../../settings/markerSettings';

export type ProfileActionType = {type: 'ADD_PROFILE'}

export type ProfileContextType = {
    profilesState: ProfileData[]
    profilesDispatch: React.Dispatch<ProfileActionType>
}

//Reducer
const addProfile = (state: ProfileData[]) => {
    return [...state, {
        id: uuid(),
        name: '',
        imageData: '',
        markers: [],
        prescriptionList: [],
        printSize: {printWidth: 0, printHeight: 0}
    }]
}

const profilesReducer = (state: ProfileData[], action: ProfileActionType) => {
    switch(action.type) {
        case 'ADD_PROFILE': return addProfile(state)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const ProfileContext = createContext<ProfileContextType | null>(null);
const initialState = [] as ProfileData[]

//Context Provider
export const ProfileContextProvider = ({children}: IContextProviderProps) => {
    const [profilesState, profilesDispatch] = useReducer(profilesReducer, initialState)
    
    useEffect(() => {
    },[])

    return (
        <ProfileContext.Provider value={{profilesState, profilesDispatch}}>
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContext;

