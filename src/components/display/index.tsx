import { useState, useEffect, useContext, useRef, useMemo } from 'react';
import useElement from '../../hooks/useElement';
import useCanvas from '../../hooks/useCanvas';
import readFile from './utils/readFile';
import dataToImage from './utils/dataToImage';
import calculateScale from './utils/calculateScale';
import splitArray from '../../global-utils/splitArray';
import { useReactToPrint } from 'react-to-print';

import ImageData from '../../types/state/imageData';
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

interface IDisplayProps {
    width: number
    height: number
}

const Display: React.FunctionComponent<IDisplayProps> = () => {
    const {markersState, markersDispatch} = useContext(MarkerContext) as MarkerContextType;
    const {prescriptionMarkerState, prescriptionMarkerDispatch} = useContext(PrescriptionMarkerContext) as PrescriptionMarkerContextType;
    const {prescriptionListState, splitPrescriptionId} = useContext(PrescriptionListContext) as PrescriptionListContextType;
    const {textSettingsState} = useContext(TextSettingsContext) as TextSettingsContextType; 
    const {imageState, imageDispatch} = useContext(ImageContext) as ImageContextType;
    const {profilesState, activeProfileId} = useContext(ProfileContext) as ProfileContextType;
    const activeProfile = useMemo(() => profilesState.find(profile => profile.id === activeProfileId),[profilesState, activeProfileId]);
    
    const [canvasRef, resizeCanvas, drawImageToCanvas, clearCanvas] = useCanvas(DISPLAY_SETTINGS.DEFAULT_WIDTH, DISPLAY_SETTINGS.DEFAULT_HEIGHT);
    const [imageRef, imageData, resizeImage] = useElement<HTMLImageElement>(DISPLAY_SETTINGS.DEFAULT_WIDTH, DISPLAY_SETTINGS.DEFAULT_HEIGHT);
    const [containerRef, containerData, resizeContainer] = useElement<HTMLDivElement>(DISPLAY_SETTINGS.DEFAULT_WIDTH, DISPLAY_SETTINGS.DEFAULT_HEIGHT);
    const [backContainerRef, backContainerData, resizeBackContainer] = useElement<HTMLDivElement>(DISPLAY_SETTINGS.DEFAULT_WIDTH, DISPLAY_SETTINGS.DEFAULT_HEIGHT);
    
    const [hideGuidelines, setHideGuidelines] = useState(false);
    const [frontPrescriptionList, backPrescriptionList] = useMemo<PrescriptionData[][]>(() => {
        let splitIndex = prescriptionListState.findIndex(prescription => prescription.id === splitPrescriptionId);
        return splitArray(splitIndex, prescriptionListState)
    },[prescriptionListState, splitPrescriptionId])

    // console.log(imageState);
    // console.log(activeProfile?.printWidth, activeProfile?.printHeight)

    //HANDLERS
    
    // Print
    // const printStyle = useMemo(() => {
    //     const width = activeProfile?.printWidth || PRINT_SETTINGS.DEFAULT_PRINT_WIDTH;
    //     const height = activeProfile?.printHeight || PRINT_SETTINGS.DEFAULT_PRINT_HEIGHT;

    //     return `
    //     @media print {
    //         .display-canvas-container {
    //             background: red;
    //         }
    //     }
    //     `
    // },[activeProfile, containerData])
    
    const printPrescriptionFront = useReactToPrint({
        content: () => containerRef.current,
    })

    const printPrescriptionBack = useReactToPrint({
        content: () => backContainerRef.current,
    })

    const handlePrint = (printHookFn: () => void) => {
        setHideGuidelines(true)
        setTimeout(() => {
            printHookFn()
        }, 50)
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
            scaleFactor: calculateScale(activeProfile?.printWidth || PRINT_SETTINGS.DEFAULT_PRINT_WIDTH , image.width, 3, true)
        }})
    }
    // console.log(imageState)
    //SIDE EFFECTS
    //Resize canvas/container and draw image
    useEffect(() => {
        const image = imageRef.current;
        const container = containerRef.current;
        const backContainer = backContainerRef.current;
        if (!image || !container || !backContainer) return;
        markersDispatch({type:'RESET_MARKERS'});

        const fitDisplayToImage = (imageData: ImageData, displayWidth: number) => {
            const w = imageData.nativeWidth * imageData.scaleFactor;
            const h = imageData.nativeHeight * imageData.scaleFactor;
            const s = calculateScale(displayWidth, w, 3, true);
            
            resizeContainer(w, h);
            resizeBackContainer(w, h);
            resizeImage(w, h);
        }

        const resetDisplay = () => {
            resizeContainer(DISPLAY_SETTINGS.DEFAULT_WIDTH, DISPLAY_SETTINGS.DEFAULT_HEIGHT);
            resizeBackContainer(DISPLAY_SETTINGS.DEFAULT_WIDTH, DISPLAY_SETTINGS.DEFAULT_HEIGHT);
            resizeImage(DISPLAY_SETTINGS.DEFAULT_WIDTH, DISPLAY_SETTINGS.DEFAULT_HEIGHT);
        }
        
        if (imageState) {
            fitDisplayToImage(imageState, DISPLAY_SETTINGS.MAX_WIDTH);
        } else {
            clearCanvas()
            resetDisplay()
        }
    },[imageState, canvasRef, containerRef, backContainerRef]);

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

    const prescriptionMarkerElement = prescriptionMarkerState.length === 0 ? null : <PrescriptionMarker 
        prescriptionMarker={prescriptionMarkerState[0]} 
        prescriptionMarkerDispatch={prescriptionMarkerDispatch} 
        containerData={containerData} 
        hideGuidelines={hideGuidelines} 
        prescriptionList={frontPrescriptionList}
    />;

    const backPrescriptionMarkerElement = prescriptionMarkerState.length === 0 ? null : <PrescriptionMarker 
        prescriptionMarker={prescriptionMarkerState[1]} 
        prescriptionMarkerDispatch={prescriptionMarkerDispatch}      
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
                    <button onClick={() => setHideGuidelines(prevHideGuidelines => !prevHideGuidelines)}>{hideGuidelines ? 'Show marker guidelines' : 'Hide marker guidelines'}</button>
                </div>
                <div className="display-containers">
                    <div className='display-canvas-container' ref={containerRef}>
                        {prescriptionMarkerElement}
                        {markerElements}
                        <img className='display-image' ref={imageRef} src={imageState?.rawData || ''} alt="displayImage" />
                    </div>
                    <div className='display-canvas-container back' ref={backContainerRef}>
                        {backPrescriptionMarkerElement}
                    </div>
                </div>
            </div>
            <button onClick={() => handlePrint(printPrescriptionFront)}>Print Front Prescription</button>
            <button onClick={() => handlePrint(printPrescriptionBack)}>Print Back Prescription</button>
        </div>
    );
};

export default Display;
