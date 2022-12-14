import { IContextProviderProps } from '../../types/context/contextProviderProps';
import { createContext, useEffect, useReducer, useState } from "react";
import { v4 as uuid } from "uuid";

import ProfileData from '../../types/state/profileData';
import getArrayFromLocalStorage from '../utils/getArrayFromLocalStorage';
import MARKER_SETTINGS from '../../settings/markerSettings';

const PROFILES_DATA_KEY = 'PROFILES';
const ACTIVE_PROFILE_ID_KEY = 'ACTIVE_PROFILE_ID';

export type ProfileActionType = 
    {type: 'ADD_PROFILE' ; payload: ProfileData} |
    {type: 'EDIT_PROFILE' ; payload: {id: string, profileDataChunk: Partial<ProfileData>}} |
    {type: 'DELETE_PROFILE'; payload: {id: string}}
;

export type ProfileContextType = {
    profilesState: ProfileData[]
    profilesDispatch: React.Dispatch<ProfileActionType>
    activeProfileId: string
    setActiveProfileId: React.Dispatch<React.SetStateAction<string>>
}

//Reducer

const addProfile = (state: ProfileData[], newProfile: ProfileData) => {
    return [...state, newProfile]
}

const editProfile = (state: ProfileData[], id: string, profileDataChunk: Partial<ProfileData>) => {
    return state.map(profile => {
        return (profile.id !== id) ? profile : {...profile, ...profileDataChunk}
    })
}

const deleteProfile = (state: ProfileData[], deleteId: string) => {
    return state.filter(profile => profile.id !== deleteId)
}

const profilesReducer = (state: ProfileData[], action: ProfileActionType) => {
    switch(action.type) {
        case 'ADD_PROFILE': return addProfile(state, action.payload)
        case 'EDIT_PROFILE': return editProfile(state, action.payload.id,action.payload.profileDataChunk)
        case 'DELETE_PROFILE': return deleteProfile(state, action.payload.id)
        default: throw new Error(`Invalid dispatch action`)
    }
}

const ProfileContext = createContext<ProfileContextType | null>(null);
const initialProfilesState: ProfileData[] = getArrayFromLocalStorage(PROFILES_DATA_KEY);
const initialActiveProfileIdState: string = localStorage.getItem(ACTIVE_PROFILE_ID_KEY) || '';

//Context Provider
export const ProfileContextProvider = ({children}: IContextProviderProps) => {
    const [profilesState, profilesDispatch] = useReducer(profilesReducer, initialProfilesState)
    const [activeProfileId, setActiveProfileId] = useState(initialActiveProfileIdState)
    // console.log(profilesState)
    // console.log(activeProfileId)
    // console.log(profilesState.find(profile => profile.id === activeProfileId));
    useEffect(() => {
        localStorage.setItem(PROFILES_DATA_KEY, JSON.stringify(profilesState))
    },[profilesState])

    useEffect(() => {
        localStorage.setItem(ACTIVE_PROFILE_ID_KEY, activeProfileId)
    },[activeProfileId])

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

