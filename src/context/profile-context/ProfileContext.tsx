import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useEffect, useReducer, useState } from "react";
import { v4 as uuid } from "uuid";

import ProfileData, { ProfileDataChunk } from '../../types/state/profileData';
import getArrayFromLocalStorage from '../utils/getArrayFromLocalStorage';
import MARKER_SETTINGS from '../../settings/markerSettings';

const DATA_KEY = 'PROFILES';

export type ProfileActionType = 
    {type: 'CREATE_NEW_PROFILE'} |
    {type: 'ADD_PROFILE' ; payload: ProfileData} |
    {type: 'EDIT_PROFILE' ; payload: {id: string, profileDataChunk: ProfileDataChunk}} |
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
        name: 'profile',
        imageData: null,
        markers: [],
        prescriptionList: [],
        textSettings: {
            globalTextSize: 12,
            color: 'black',
            fontWeight: 500,        
        },
        printWidth: 0,
        printHeight: 0
    }]
}

const addProfile = (state: ProfileData[], newProfile: ProfileData) => {
    return [...state, newProfile]
}

const editProfile = (state: ProfileData[], id: string, profileDataChunk: ProfileDataChunk) => {
    return state.map(profile => {
        return (profile.id !== id) ? profile : {...profile, ...profileDataChunk}
    })
}

const deleteProfile = (state: ProfileData[], deleteId: string) => {
    return state.filter(profile => profile.id !== deleteId)
}

const profilesReducer = (state: ProfileData[], action: ProfileActionType) => {
    switch(action.type) {
        case 'CREATE_NEW_PROFILE': return createNewProfile(state)
        case 'ADD_PROFILE': return addProfile(state, action.payload)
        case 'EDIT_PROFILE': return editProfile(state, action.payload.id,action.payload.profileDataChunk)
        case 'DELETE_PROFILE': return deleteProfile(state, action.payload.id)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const ProfileContext = createContext<ProfileContextType | null>(null);
const initialProfilesState: ProfileData[] = getArrayFromLocalStorage(DATA_KEY)

//Context Provider
export const ProfileContextProvider = ({children}: IContextProviderProps) => {
    const [profilesState, profilesDispatch] = useReducer(profilesReducer, initialProfilesState)
    const [activeProfileId, setActiveProfileId] = useState('')
    console.log(profilesState)

    useEffect(() => {
        localStorage.setItem(DATA_KEY, JSON.stringify(profilesState))
    },[profilesState])

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

