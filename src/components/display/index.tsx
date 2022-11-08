import { useState, useEffect, useContext, useRef, useMemo } from 'react';
import useElement from '../../hooks/useElement';
import useCanvas from '../../hooks/useCanvas';

import readFile from './utils/readFile';
import dataToImage from './utils/dataToImage';
import calculateScale from './utils/calculateScale';

import ImageData from '../../types/state/imageData';

import Marker from './components/marker';
import PrescriptionMarker from './components/prescription-marker';
import ReactToPrint, { useReactToPrint } from 'react-to-print';


import ImageContext, { ImageContextType } from '../../context/image-context/ImageContext';
import MarkerContext, { MarkerContextType } from '../../context/marker-context/MarkerContext';
import PrescriptionMarkerContext, { PrescriptionMarkerContextType } from '../../context/prescription-marker-context/PrescriptionMarkerContext';
import PrescriptionListContext, { PrescriptionListContextType } from '../../context/prescription-list-context/PrescriptionListContext';
import TextSettingsContext, { TextSettingsContextType } from '../../context/text-settings-context/TextSettingsContext';

import './style.css'
import ProfileContext, { ProfileContextType } from '../../context/profile-context/ProfileContext';
import splitArray from '../../global-utils/splitArray';
import PrescriptionData from '../../types/state/prescriptionData';

interface IDisplayProps {
    width: number
    height: number
}

const MAX_WIDTH = 600;
const INITIAL_WIDTH = 300;
const INITIAL_HEIGHT = 300;

const Display: React.FunctionComponent<IDisplayProps> = () => {
    const {markersState, markersDispatch} = useContext(MarkerContext) as MarkerContextType;
    const {prescriptionMarkerState, prescriptionMarkerDispatch} = useContext(PrescriptionMarkerContext) as PrescriptionMarkerContextType;
    const {prescriptionListState, splitPrescriptionId} = useContext(PrescriptionListContext) as PrescriptionListContextType;
    const {textSettingsState} = useContext(TextSettingsContext) as TextSettingsContextType; 
    const {imageState, imageDispatch} = useContext(ImageContext) as ImageContextType;
    const {profilesState, activeProfileId} = useContext(ProfileContext) as ProfileContextType;
    const activeProfile = useMemo(() => profilesState.find(profile => profile.id === activeProfileId),[profilesState, activeProfileId]);
    
    const [canvasRef, resizeCanvas, drawImageToCanvas, clearCanvas] = useCanvas(INITIAL_WIDTH, INITIAL_HEIGHT);
    const [containerRef, containerData, resizeContainer] = useElement<HTMLDivElement>(INITIAL_WIDTH, INITIAL_HEIGHT);
    const [backContainerRef, backContainerData, resizeBackContainer] = useElement<HTMLDivElement>(INITIAL_WIDTH, INITIAL_HEIGHT);
    
    const [hideGuidelines, setHideGuidelines] = useState(false);
    const [frontPrescriptionList, backPrescriptionList] = useMemo<PrescriptionData[][]>(() => {
        let splitIndex = prescriptionListState.findIndex(prescription => prescription.id === splitPrescriptionId);
        // if (splitIndex === -1 || splitIndex === undefined) splitIndex = 0;

        console.log(splitIndex)
        console.log(splitPrescriptionId)
        return splitArray(splitIndex, prescriptionListState)
    },[prescriptionListState, splitPrescriptionId])
    // console.log(frontPrescriptionList, backPrescriptionList)

    //HANDLERS

    //Print
    const printStyle = useMemo(() => {
        const width = activeProfile?.printWidth || 200;
        const height = activeProfile?.printHeight || 200
        const scaleWidth = (activeProfile?.printWidth || 200) / containerData.width;
        const scaleHeight = (activeProfile?.printHeight || 200) / containerData.height;

        // width: ${width}px;
        // height: ${height}px;
        return `
        @media print {
            .display-canvas-container {
                    transform: scale(${scaleWidth}, ${scaleHeight});
                }
            }
        `
    },[activeProfile, containerData])
    
    const printPrescriptionFront = useReactToPrint({
        content: () => containerRef.current,
        pageStyle: printStyle
    })

    const printPrescriptionBack = useReactToPrint({
        content: () => backContainerRef.current,
        pageStyle: printStyle
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
            scaleFactor: calculateScale(MAX_WIDTH, image.width, 3)
        }})
    }

    //SIDE EFFECTS
    //Resize canvas/container and draw image
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const backContainer = backContainerRef.current;
        if (!canvas || !container || !backContainer) return;
        markersDispatch({type:'RESET_MARKERS'});

        const fitDisplayToImage = (imageData: ImageData) => {
            const w = imageData.nativeWidth;
            const h = imageData.nativeHeight;
            const s = imageData.scaleFactor;
            
            resizeContainer(w * s, h * s);
            resizeBackContainer(w * s, h * s);
            resizeCanvas(w, h, s);
        }

        const resetDisplay = () => {
            resizeContainer(INITIAL_WIDTH, INITIAL_HEIGHT);
            resizeBackContainer(INITIAL_WIDTH, INITIAL_HEIGHT);
            resizeCanvas(INITIAL_WIDTH, INITIAL_HEIGHT);            
        }
        
        if (imageState) {
            fitDisplayToImage(imageState)
            drawImageToCanvas(imageState.rawData);
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
                        <canvas className='display-canvas' ref={canvasRef} />
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
