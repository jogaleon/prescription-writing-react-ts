import { useContext, useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';


import ProfileContext, { ProfileContextType } from "../../../../context/profile-context/ProfileContext";
import MARKER_SETTINGS from '../../../../settings/markerSettings';

interface IEditProfileProps {
    profileId?: string
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const EditProfile: React.FunctionComponent<IEditProfileProps> = ({profileId, setModalOpen}) => {
    const {profilesState, profilesDispatch} = useContext(ProfileContext) as ProfileContextType
    const selectedProfile = useMemo(() => profilesState.find(profile => profile.id === profileId),[profilesState, profileId])
    const [input, setInput] = useState({
        name: selectedProfile?.name || '',
        printWidth: selectedProfile?.printWidth || 0,
        printHeight: selectedProfile?.printHeight || 0
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(prevInput => {
            return {
                ...prevInput,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleButtonClick = () => {
        if (!profileId) {
            profilesDispatch({type: 'ADD_PROFILE', payload: {
                id: uuid(),
                name: input.name,
                imageData: null,
                markers: [],
                prescriptionList: [],
                prescriptionMarker: {
                    x: 0,
                    y: 0,
                    width: MARKER_SETTINGS.MIN_WIDTH,
                    height: MARKER_SETTINGS.MIN_HEIGHT,
                },
                textSettings: {
                    markerGlobalTextSize: '12',
                    prescriptionTextSize: '12',
                    prescriptionEntrySpacing: '12',
                    color: '#000000',
                    fontWeight: 'normal',        
                },
                printWidth: input.printWidth,
                printHeight: input.printHeight,
            }})
        } else {
            profilesDispatch({type: 'EDIT_PROFILE', payload: {id: profileId, profileDataChunk: {
                name: input.name,
                printWidth: input.printWidth,
                printHeight: input.printHeight
            }}})
        }
        
        setModalOpen(false)
    }
  
    return (
    <div className="EditProfile">
        <h1>{(profileId) ? `Edit Profile` : `Create New Profile`}</h1>
        <label htmlFor="name">Name: </label>
        <input type="text" name="name" value={input.name} onChange={handleInputChange} /><br />
        <p>Print Size</p>
        <label htmlFor="printWidth">Width: </label>
        <input type="number" name="printWidth" value={input.printWidth} onChange={handleInputChange} /><br />
        <label htmlFor="printHeight">Height: </label>
        <input type="number" name="printHeight" value={input.printHeight} onChange={handleInputChange} /><br />
        <button onClick={handleButtonClick}>Save Profile</button>
    </div>
    );
};

export default EditProfile;
