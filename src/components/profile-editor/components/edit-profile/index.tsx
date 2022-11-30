import React, { useContext, useState, useMemo, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import ProfileContext, { ProfileContextType } from "../../../../context/profile-context/ProfileContext";

import MARKER_SETTINGS from '../../../../settings/markerSettings';
import PrescriptionMarkerData from '../../../../types/state/prescriptionMarkerData';
import calculateScreenPPI from './utils/calculateScreenPPI';

import TEXT_SETTINGS from '../../../../settings/textSettings';
import setConverterPPI, { Unit } from './utils/convertToUnit';

interface IEditProfileProps {
    profileId?: string
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DEFAULT_PRESCRIPTION_MARKERS: PrescriptionMarkerData[] = [
    {
        id: uuid(),
        x: 0,
        y: 0,
        width: MARKER_SETTINGS.MIN_WIDTH,
        height: MARKER_SETTINGS.MIN_HEIGHT,
    }, {
        id: uuid(),
        x: 0,
        y: 0,
        width: MARKER_SETTINGS.MIN_WIDTH,
        height: MARKER_SETTINGS.MIN_HEIGHT,
    }
]

const EditProfile: React.FunctionComponent<IEditProfileProps> = ({profileId, setModalOpen}) => {
    const {profilesState, profilesDispatch} = useContext(ProfileContext) as ProfileContextType
    const activeProfile = useMemo(() => profilesState.find(profile => profile.id === profileId), [profilesState, profileId]);

    const [screenPPI, setScreenPPI] = useState(() => calculateScreenPPI());
    const convertUnit = useMemo(() => setConverterPPI(screenPPI), [screenPPI])  
    
    const [input, setInput] = useState({
        name: activeProfile?.name || '',
        printWidth: activeProfile?.printWidth || 0,
        printHeight: activeProfile?.printHeight || 0,
        unit: 'px'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(prevInput => {
            return {
                ...prevInput,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(prevInput => {
            const convertedWidth = convertUnit(prevInput.printWidth, prevInput.unit as Unit, e.target.value as Unit); 
            const convertedHeight = convertUnit(prevInput.printHeight, prevInput.unit as Unit, e.target.value as Unit); 
            
            return {
                ...prevInput,
                printWidth: convertedWidth,
                printHeight: convertedHeight,
                unit: e.target.value
            }
        })
    }

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value)
    }


    const handleButtonClick = () => {
        //New profile
        if (!profileId) {
            profilesDispatch({type: 'ADD_PROFILE', payload: {
                id: uuid(),
                name: input.name,
                imageData: null,
                markers: [],
                prescriptionList: [],
                prescriptionMarker: DEFAULT_PRESCRIPTION_MARKERS,
                textSettings: {
                    markerGlobalTextSize: '12',
                    prescriptionTextSize: '12',
                    prescriptionEntrySpacing: '12',
                    color: '#000000',
                    fontWeight: 'normal',        
                },
                printWidth: input.printWidth,
                printHeight: input.printHeight,
            }});
        //Update profile
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
        <span>Unit: </span>        
        <input type="radio" name="unit" id="unit-px" value="px" checked={input.unit === "px"} onChange={handleUnitChange} />
        <label htmlFor="unit-px">px</label>
        <input type="radio" name="unit" id="unit-mm" value="mm" checked={input.unit === "mm"} onChange={handleUnitChange} />
        <label htmlFor="unit-mm">mm</label>
        <input type="radio" name="unit" id="unit-in" value="in" checked={input.unit === "in"} onChange={handleUnitChange} />
        <label htmlFor="unit-in">in</label> <br/>

        <label htmlFor="printSizePresets">Paper Sizes: </label>
        <select name="printSizePresets" onChange={handlePresetChange}>
            <option value="Legal">Legal</option>
            <option value="Letter">Letter</option>
            <option value="A4">A4</option>
        </select><br />
        <label htmlFor="printWidth">Width: </label>
        <input type="number" name="printWidth" value={input.printWidth} onChange={handleInputChange} /><br />
        <label htmlFor="printHeight">Height: </label>
        <input type="number" name="printHeight" value={input.printHeight} onChange={handleInputChange} /><br />
        <button onClick={handleButtonClick}>Save Profile</button>
    </div>
    );
};

export default EditProfile;
