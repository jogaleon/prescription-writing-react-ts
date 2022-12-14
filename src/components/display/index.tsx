import { useState, useEffect, useContext, useRef, useMemo } from 'react';
import useElement from '../../hooks/useElement';
import readFile from './utils/readFile';
import dataToImage from './utils/dataToImage';
import calculateScale from './utils/calculateScale';
import splitArray from '../../global-utils/splitArray';
import setConverterPPI from '../profile-editor/components/edit-profile/utils/convertToUnit';
import { useReactToPrint } from 'react-to-print';

import PrescriptionData from '../../types/state/prescriptionData';

import Marker from './components/marker';
import PrescriptionMarker from './components/prescription-marker';

import ImageContext, { ImageContextType } from '../../context/image-context/ImageContext';
import MarkerContext, { MarkerContextType } from '../../context/marker-context/MarkerContext';
import PrescriptionMarkerContext, { PrescriptionMarkerContextType } from '../../context/prescription-marker-context/PrescriptionMarkerContext';
import PrescriptionListContext, { PrescriptionListContextType } from '../../context/prescription-list-context/PrescriptionListContext';
import TextSettingsContext, { TextSettingsContextType } from '../../context/text-settings-context/TextSettingsContext';
import ProfileContext, { ProfileContextType } from '../../context/profile-context/ProfileContext';

import DISPLAY_SETTINGS from '../../settings/displaySettings';
import PRINT_SETTINGS from '../../settings/printSettings';

import './style.css'
import roundNum from '../../global-utils/roundNum';

interface IDisplayProps {
}
const Display: React.FunctionComponent<IDisplayProps> = () => {
    const {markersState, markersDispatch} = useContext(MarkerContext) as MarkerContextType;
    const {prescriptionMarkersState, prescriptionMarkersDispatch} = useContext(PrescriptionMarkerContext) as PrescriptionMarkerContextType;
    const {prescriptionListState, prescriptionSplitId} = useContext(PrescriptionListContext) as PrescriptionListContextType;
    const {textSettingsState} = useContext(TextSettingsContext) as TextSettingsContextType; 
    const {imageState, imageDispatch} = useContext(ImageContext) as ImageContextType;
    const {profilesState, activeProfileId} = useContext(ProfileContext) as ProfileContextType;
    const activeProfile = useMemo(() => profilesState.find(profile => profile.id === activeProfileId),[profilesState, activeProfileId]);

    const [imageRef, imageData, resizeImage] = useElement<HTMLImageElement>(DISPLAY_SETTINGS.DEFAULT_WIDTH, DISPLAY_SETTINGS.DEFAULT_HEIGHT);
    const [containerRef, containerData, resizeContainer] = useElement<HTMLDivElement>(DISPLAY_SETTINGS.DEFAULT_WIDTH, DISPLAY_SETTINGS.DEFAULT_HEIGHT);
    const [backContainerRef, backContainerData, resizeBackContainer] = useElement<HTMLDivElement>(DISPLAY_SETTINGS.DEFAULT_WIDTH, DISPLAY_SETTINGS.DEFAULT_HEIGHT);
    const frontWrapperRef = useRef(null);
    const backWrapperRef = useRef(null);

    const [hideGuidelines, setHideGuidelines] = useState(false);

    const [frontPrescriptionList, backPrescriptionList] = useMemo<PrescriptionData[][]>(() => {
        let splitIndex = prescriptionListState.findIndex(prescription => prescription.id === prescriptionSplitId);
        return splitArray(splitIndex, prescriptionListState)
    },[prescriptionListState, prescriptionSplitId])

    //HANDLERS

    // Print
    const printStyle = useMemo(() => {
        const convertUnit = setConverterPPI(96);
        const unit = activeProfile?.printSettings?.unit || 'px';
        const printWidth = convertUnit(activeProfile?.printSettings?.printWidth || PRINT_SETTINGS.DEFAULT_PRINT_WIDTH, unit, 'px') ;
        const printHeight = convertUnit(activeProfile?.printSettings?.printHeight || PRINT_SETTINGS.DEFAULT_PRINT_HEIGHT, unit, 'px');
        // const printWidth = 793;
        // const printHeight = 1122;
        const isPortrait = activeProfile?.printSettings?.orientation === "portrait" || true;

        const displayWidth = containerData.width || DISPLAY_SETTINGS.DEFAULT_WIDTH;
        const displayHeight = containerData.height || DISPLAY_SETTINGS.DEFAULT_HEIGHT;
        const scaleW = calculateScale(printWidth, displayWidth, 3, false);
        const scaleH = calculateScale(printHeight, displayHeight, 3, false);
        // console.log(printWidth, printHeight, unit);
        // console.log("print", printWidth, printHeight);
        // console.log("display", displayWidth, displayHeight);
        // console.log(scaleW, scaleH)

        return `
        @media print {
            .display-container {
                border: none !important;
                transform: scale(${scaleW}, ${scaleH});
            }
            .display-container-wrapper {
                width: ${printWidth}px;
                height: ${printHeight}px;
                overflow: hidden;
                border: none;
            }
            .Marker {
                border: none !important;
            }
            .marker-label {
                display: none !important;
            }
            .marker-resize-handle {
                display: none !important;
            }
        }
        `
    },[activeProfile?.printSettings, containerData])
    
    const printPrescriptionFront = useReactToPrint({
        content: () => frontWrapperRef.current,
        pageStyle: () => printStyle
    })

    const printPrescriptionBack = useReactToPrint({
        content: () => backWrapperRef.current,
        pageStyle: () => printStyle
    })

    const handlePrint = (printHookFn: () => void) => {
        printHookFn()
    }

    //Image File Input
    const handleInputFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const data = await readFile(e.target.files[0]);
        const image = await dataToImage(data);
        imageDispatch({type:'SAVE_IMAGE_DATA', payload:{
            rawData: data,
            nativeWidth: image.width,
            nativeHeight: image.height,
        }})
    }

    //Hide guidelines
    const toggleMarkerGuidelines = () => {
        setHideGuidelines(prevHideGuidelines => !prevHideGuidelines)
    }

    //SIDE EFFECTS
    //Resize canvas/container and draw image
    useEffect(() => {
        const image = imageRef.current;
        const container = containerRef.current;
        const backContainer = backContainerRef.current;
        if (!image || !container || !backContainer) return;

        const resizeDisplay = (width: number, height: number) => {
            const w = width;
            const h = height;

            resizeContainer(w, h);
            resizeBackContainer(w, h);
            resizeImage(w, h);
        }

        if (!imageState) return resizeDisplay(DISPLAY_SETTINGS.DEFAULT_WIDTH, DISPLAY_SETTINGS.DEFAULT_HEIGHT);
        markersDispatch({type:'RESET_MARKERS'});
        prescriptionMarkersDispatch({type: 'RESET_PRESCRIPTION_MARKERS'});

        const scaleFactor = calculateScale(DISPLAY_SETTINGS.MAX_WIDTH , imageState.nativeWidth, 3, true);
        const displayWidth = imageState.nativeWidth * scaleFactor;
        const displayHeight = imageState.nativeHeight * scaleFactor;

        resizeDisplay(displayWidth, displayHeight);
    },[imageState, imageRef, containerRef, backContainerRef, markersDispatch, prescriptionMarkersDispatch, resizeImage, resizeContainer, resizeBackContainer]);

    //ELEMENTS
    const markerElements = markersState.map((marker, i) => {
        return <Marker 
            key={marker.id}
            containerData={containerData}
            marker={marker}
            markersDispatch={markersDispatch}
            color={textSettingsState.color}
            fontWeight={textSettingsState.fontWeight}
            hideGuidelines={hideGuidelines}
        />
    })

    const prescriptionMarkerElement = !prescriptionMarkersState[0] ? null : <PrescriptionMarker 
        prescriptionMarker={prescriptionMarkersState[0]} 
        prescriptionMarkersDispatch={prescriptionMarkersDispatch} 
        prescriptionList={frontPrescriptionList}
        containerData={containerData} 
        hideGuidelines={hideGuidelines} 
    />;

    const backPrescriptionMarkerElement = !prescriptionMarkersState[1] ? null : <PrescriptionMarker 
        prescriptionMarker={prescriptionMarkersState[1]} 
        prescriptionMarkersDispatch={prescriptionMarkersDispatch}      
        prescriptionList={backPrescriptionList}
        containerData={backContainerData} 
        hideGuidelines={hideGuidelines} 
    />;

    return (
        <div>
            <div className='Display'>
                <h1>Display</h1>
                <div className='display-controls'>
                    <input 
                        type="file"
                        accept='image/png, image/jpeg'
                        onChange={handleInputFile}
                    />
                    <button onClick={toggleMarkerGuidelines}>{hideGuidelines ? 'Show marker guidelines' : 'Hide marker guidelines'}</button>
                </div>
                <div className="display-containers">
                    <div className="display-container-wrapper" ref={frontWrapperRef}>
                        <div className='display-container' ref={containerRef}>
                            {prescriptionMarkerElement}
                            {markerElements}
                            <img className='display-image' ref={imageRef} src={imageState?.rawData || ''} alt="displayImage" />
                        </div>
                    </div>
                    <div className="display-container-wrapper" ref={backWrapperRef}>
                        <div className='display-container back' ref={backContainerRef}>
                            {backPrescriptionMarkerElement}
                        </div>
                    </div>
                </div>  
            </div>
            <button onClick={() => handlePrint(printPrescriptionFront)}>Print Front Prescription</button>
            <button onClick={() => handlePrint(printPrescriptionBack)}>Print Back Prescription</button>
        </div>
    );
};

export default Display;
