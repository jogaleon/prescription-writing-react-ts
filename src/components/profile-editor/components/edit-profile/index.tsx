import React, { useContext, useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import roundNum from '../../../../global-utils/roundNum';

import ProfileContext, { ProfileContextType } from "../../../../context/profile-context/ProfileContext";

import MARKER_SETTINGS from '../../../../settings/markerSettings';
import PrescriptionMarkerData from '../../../../types/state/prescriptionMarkerData';
import calculateScreenPPI from './utils/calculateScreenPPI';

import TEXT_SETTINGS from '../../../../settings/textSettings';
import DISPLAY_SETTINGS from '../../../../settings/displaySettings';
import PRINT_SIZE_PRESETS from './utils/printSizePresets';
import setConverterPPI, { Unit } from './utils/convertToUnit';
import PrintSettings from '../../../../types/state/printSettings';

interface IEditProfileProps {
    profileId?: string
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface IState extends PrintSettings<string> {
        name: string;
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

const DECIMAL_PLACES = 2;

const EditProfile: React.FunctionComponent<IEditProfileProps> = ({profileId, setModalOpen}) => {
    const {profilesState, profilesDispatch} = useContext(ProfileContext) as ProfileContextType
    const activeProfile = useMemo(() => profilesState.find(profile => profile.id === profileId), [profilesState, profileId]);

    const [screenPPI, setScreenPPI] = useState(() => calculateScreenPPI());
    const [input, setInput] = useState<IState>({
        name: activeProfile?.name || '',
        printWidth: activeProfile?.printSettings?.printWidth.toString() ||  '0',
        printHeight: activeProfile?.printSettings?.printHeight.toString() || '0',
        unit: activeProfile?.printSettings?.unit || 'px',
        orientation: activeProfile?.printSettings?.orientation || 'portrait',
        preset: activeProfile?.printSettings?.preset || 'custom',
    });
    
    const convertUnit = useMemo(() => setConverterPPI(screenPPI), [screenPPI]);
    const roundedWidth = useMemo(() => roundNum(parseFloat(input.printWidth), DECIMAL_PLACES, true),[input.printWidth]);
    const roundedHeight = useMemo(() => roundNum(parseFloat(input.printHeight), DECIMAL_PLACES, true),[input.printHeight]);
    // console.log(typeof roundedWidth);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(prevInput => {
            return {
                ...prevInput,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // if (parseFloat(e.target.value) < 0) return;
        setInput(prevInput => {
            return {
                ...prevInput,
                [e.target.name]: e.target.value
            }
        })
    }


    const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(prevInput => {
            const prevUnit = prevInput.unit;
            const newUnit = e.target.value as Unit;
            const convertedWidth = convertUnit(parseFloat(prevInput.printWidth), prevUnit, newUnit).toString(); 
            const convertedHeight = convertUnit(parseFloat(prevInput.printHeight), prevUnit, newUnit).toString(); 

            return {
                ...prevInput,
                printWidth: convertedWidth,
                printHeight: convertedHeight,
                unit: newUnit
            }
        })
    }

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'custom') {
            return setInput(prevInput => ({
                ...prevInput,
                preset: e.target.value,
            }))
        }

        const preset = PRINT_SIZE_PRESETS.find(preset => preset.value === e.target.value);
        if (!preset) return;
        setInput(prevInput => ({
            ...prevInput,
            preset: e.target.value,
            unit: preset.unit,
            printWidth: preset.width.toString(),
            printHeight: preset.height.toString(),
        }))
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
                prescriptionSplitId: '',
                prescriptionMarker: DEFAULT_PRESCRIPTION_MARKERS,
                textSettings: {
                    markerGlobalTextSize: 12,
                    prescriptionTextSize: 12,
                    prescriptionEntrySpacing: 12,
                    color: '#000000',
                    fontWeight: 'normal',        
                },
                printSettings: {
                    preset: input.preset,
                    printWidth: parseFloat(input.printWidth),
                    printHeight: parseFloat(input.printHeight),
                    unit: input.unit,
                    orientation: input.orientation,
                },
            }});
        //Update profile
        } else {
            profilesDispatch({type: 'EDIT_PROFILE', payload: {id: profileId, profileDataChunk: {
                name: input.name,
                printSettings: {
                    preset: input.preset,
                    printWidth: parseFloat(input.printWidth),
                    printHeight: parseFloat(input.printHeight),
                    unit: input.unit,
                    orientation: input.orientation,
                }
            }}})
        }
        
        setModalOpen(false)
    }

    const printSizePresetsElements = PRINT_SIZE_PRESETS.map(preset => {
        return <option key={uuid()} value={preset.value}>{preset.name}</option>
    })
  
    return (
    <div className="EditProfile">
        <h1>{(profileId) ? `Edit Profile` : `Create New Profile`}</h1>
        <label htmlFor="name">Name: </label>
        <input type="text" name="name" value={input.name} onChange={handleInputChange} /><br />
        
        <p>Print Size</p>
        <div>
            <label htmlFor="printSizePresets">Paper Sizes: </label>
            <select value={input.preset} name="printSizePresets" onChange={handlePresetChange}>
                <option value="custom">Custom</option>
                {printSizePresetsElements}
            </select><br />
        </div>
        <div>
            <span>Unit: </span>
            <input type="radio" name="unit" id="unit-px" value="px" checked={input.unit === "px"} onChange={handleUnitChange} />
            <label htmlFor="unit-px">px</label>
            <input type="radio" name="unit" id="unit-mm" value="mm" checked={input.unit === "mm"} onChange={handleUnitChange} />
            <label htmlFor="unit-mm">mm</label>
            <input type="radio" name="unit" id="unit-in" value="in" checked={input.unit === "in"} onChange={handleUnitChange} />
            <label htmlFor="unit-in">in</label> <br/>
        </div>
        <div>
            <span>Orientation: </span>
            <input type="radio" name="orientation" id="orientation-portrait" value="portrait" checked={input.orientation === "portrait"} onChange={handleInputChange} />
            <label htmlFor="orientation-portrait">Portrait</label>
            <input type="radio" name="orientation" id="orientation-landscape" value="landscape" checked={input.orientation === "landscape"} onChange={handleInputChange} />
            <label htmlFor="orientation-landscape">Landscape</label>
        </div>
        <div>
            <span>Dimensions: </span><br/>
            <label htmlFor="printWidth">Width: </label>
            <input type="number" name="printWidth" value={roundedWidth} disabled={input.preset !== 'custom'} min="0" onChange={handleSizeChange} /><br />
            <label htmlFor="printHeight">Height: </label>
            <input type="number" name="printHeight" value={roundedHeight} disabled={input.preset !== 'custom'} min="0" onChange={handleSizeChange} /><br />
        </div>
        <button onClick={handleButtonClick}>Save Profile</button>
    </div>
    );
};

export default EditProfile;
