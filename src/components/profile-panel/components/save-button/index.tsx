import { useContext } from 'react';

import ImageContext, { ImageContextType } from '../../../../context/image-context/ImageContext';
import MarkerContext, { MarkerContextType } from '../../../../context/marker-context/MarkerContext';
import ProfileContext, { ProfileContextType } from '../../../../context/profile-context/ProfileContext';
import TextSettingsContext, { TextSettingsContextType } from '../../../../context/text-settings-context/TextSettingsContext';
import { ProfileDataChunk } from '../../../../types/state/profileData';

import './style.css';

interface ISaveButtonProps {
}

const SaveButton: React.FunctionComponent<ISaveButtonProps> = (props) => {
    const {activeProfileId, profilesDispatch} = useContext(ProfileContext) as ProfileContextType
    const {markersState} = useContext(MarkerContext) as MarkerContextType
    const {imageState} = useContext(ImageContext) as ImageContextType
    const {textSettingsState} = useContext(TextSettingsContext) as TextSettingsContextType

    const buttonClickHandler = () => {
        const newDataChunk: ProfileDataChunk = {
            markers: markersState,
            imageData: imageState,
            textSettings: textSettingsState
        }
        profilesDispatch({type: 'EDIT_PROFILE', payload: {id: activeProfileId, profileDataChunk: newDataChunk}})
    }
    
    return (
        <button className="SaveButton" onClick={buttonClickHandler}>Save Profile</button>
    );
};

export default SaveButton;