import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useEffect, useReducer, useState } from "react";
import { v4 as uuid } from "uuid";

import ProfileData from '../../types/state/profileData';
import getArrayFromLocalStorage from '../utils/getArrayFromLocalStorage';
import MARKER_SETTINGS from '../../settings/markerSettings';

export type ProfileActionType = 
    {type: 'CREATE_NEW_PROFILE'} |
    {type: 'DELETE_PROFILE'; payload: {id: string}}
;

export type ProfileContextType = {
    profilesState: ProfileData[]
    profilesDispatch: React.Dispatch<ProfileActionType>
    activeProfileId: string
    setActiveProfileId: React.Dispatch<React.SetStateAction<string>>
}

//Reducer
const createNewProfile = (state: ProfileData[]) => {
    return [...state, {
        id: uuid(),
        name: '',
        isActive: false,
        imageData: '',
        markers: [],
        prescriptionList: [],
        textSettings: {
            globalTextSize: 0,
            color: '',
            fontWeight: 500,        
        },
        printWidth: 0,
        printHeight: 0
    }]
}

const deleteProfile = (state: ProfileData[], deleteId: string) => {
    return state.filter(profile => profile.id !== deleteId)
}

const profilesReducer = (state: ProfileData[], action: ProfileActionType) => {
    switch(action.type) {
        case 'CREATE_NEW_PROFILE': return createNewProfile(state)
        case 'DELETE_PROFILE': return deleteProfile(state, action.payload.id)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const ProfileContext = createContext<ProfileContextType | null>(null);
const initialState = [] as ProfileData[]

//Context Provider
export const ProfileContextProvider = ({children}: IContextProviderProps) => {
    const [profilesState, profilesDispatch] = useReducer(profilesReducer, initialState)
    const [activeProfileId, setActiveProfileId] = useState('')
    console.log(profilesState)

    useEffect(() => {
    },[])

    return (
        <ProfileContext.Provider value={{
            profilesState, 
            profilesDispatch,
            activeProfileId,
            setActiveProfileId
        }}>
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContext;

