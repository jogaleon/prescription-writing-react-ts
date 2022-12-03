import { useContext, useEffect, useRef } from 'react';

import ImageContext, { ImageContextType } from '../../../../context/image-context/ImageContext';
import MarkerContext, { MarkerContextType } from '../../../../context/marker-context/MarkerContext';
import PrescriptionListContext, { PrescriptionListContextType } from '../../../../context/prescription-list-context/PrescriptionListContext';
import PrescriptionMarkerContext, { PrescriptionMarkerContextType } from '../../../../context/prescription-marker-context/PrescriptionMarkerContext';
import PrintSettingsContext, { PrintSettingsContextType } from '../../../../context/print-settings-context/PrintSettingsContext';
import ProfileContext, { ProfileContextType } from '../../../../context/profile-context/ProfileContext';
import TextSettingsContext, { TextSettingsContextType } from '../../../../context/text-settings-context/TextSettingsContext';
import { ProfileDataChunk } from '../../../../types/state/profileData';

import './style.css';

interface ISaveButtonProps {
    isSaved: boolean
    setIsSaved: React.Dispatch<React.SetStateAction<boolean>>
}

const SavePanel: React.FunctionComponent<ISaveButtonProps> = ({isSaved, setIsSaved}) => {
    const SAVE_INDICATOR_STYLE = {
        backgroundColor: (isSaved) ? 'green' : 'red'
    }
    const {activeProfileId, profilesDispatch} = useContext(ProfileContext) as ProfileContextType
    const prevActiveProfileId = useRef('');
    const {markersState} = useContext(MarkerContext) as MarkerContextType
    const {prescriptionMarkersState} = useContext(PrescriptionMarkerContext) as PrescriptionMarkerContextType
    const {prescriptionListState, prescriptionSplitId} = useContext(PrescriptionListContext) as PrescriptionListContextType
    const {imageState} = useContext(ImageContext) as ImageContextType
    const {textSettingsState} = useContext(TextSettingsContext) as TextSettingsContextType
    const {printSettingsState} = useContext(PrintSettingsContext) as PrintSettingsContextType
    
    useEffect(() => {
        if (!isSaved) return
        setIsSaved(false);
        prevActiveProfileId.current = activeProfileId
    },[
        markersState,
        prescriptionMarkersState,
        prescriptionListState,
        imageState,
        textSettingsState,
        printSettingsState
    ]);

    const buttonClickHandler = () => {
        const newDataChunk: ProfileDataChunk = {
            markers: markersState,
            prescriptionList: prescriptionListState,
            prescriptionMarker: prescriptionMarkersState,
            prescriptionSplitId: prescriptionSplitId,
            imageData: imageState,
            textSettings: textSettingsState,
            printSettings: printSettingsState
        }
        profilesDispatch({type: 'EDIT_PROFILE', payload: {id: activeProfileId, profileDataChunk: newDataChunk}});
        setIsSaved(true);
    }
    
    return (
        <div className="SavePanel">
            <button className="save-button" onClick={buttonClickHandler}>Save Profile</button>
            <div className="save-indicator" style={SAVE_INDICATOR_STYLE}></div>
        </div>
    );
};

export default SavePanel;
