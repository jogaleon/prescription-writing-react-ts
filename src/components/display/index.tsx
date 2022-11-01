import { useState, useEffect, useContext, useRef } from 'react';
import useElement from '../../hooks/useElement';
import useCanvas from '../../hooks/useCanvas';

import readFile from './utils/readFile';
import dataToImage from './utils/dataToImage';
import calculateScale from './utils/calculateScale';

import ImageData from '../../types/state/imageData';

import Marker from './components/marker';
import PrescriptionMarker from './components/prescription-marker';
import ReactToPrint from 'react-to-print';


import ImageContext, { ImageContextType } from '../../context/image-context/ImageContext';
import MarkerContext, { MarkerContextType } from '../../context/marker-context/MarkerContext';
import PrescriptionMarkerContext, { PrescriptionMarkerContextType } from '../../context/prescription-marker-context/PrescriptionMarkerContext';
import PrescriptionListContext, { PrescriptionListContextType } from '../../context/prescription-list-context/PrescriptionListContext';
import TextSettingsContext, { TextSettingsContextType } from '../../context/text-settings-context/TextSettingsContext';

import './style.css'

interface IDisplayProps {
    width: number
    height: number
}

const MAX_WIDTH = 1000;
const INITIAL_WIDTH = 300;
const INITIAL_HEIGHT = 300;

const Display: React.FunctionComponent<IDisplayProps> = () => {
    const {markersState, markersDispatch} = useContext(MarkerContext) as MarkerContextType;
    const {prescriptionMarkerState} = useContext(PrescriptionMarkerContext) as PrescriptionMarkerContextType;
    const {prescriptionListState} = useContext(PrescriptionListContext) as PrescriptionListContextType;
    const {textSettingsState} = useContext(TextSettingsContext) as TextSettingsContextType; 
    const {imageState, imageDispatch} = useContext(ImageContext) as ImageContextType;
    const [hideBorder, setHideBorder] = useState(false);

    const [canvasRef, resizeCanvas, drawImageToCanvas, writeText, clearCanvas] = useCanvas(INITIAL_WIDTH, INITIAL_HEIGHT);
    const [containerRef, containerData, resizeContainer] = useElement<HTMLDivElement>(INITIAL_WIDTH, INITIAL_HEIGHT);

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

    //Resize canvas/container and draw image
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        markersDispatch({type:'RESET_MARKERS'});

        const fitDisplayToImage = (imageData: ImageData) => {
            const w = imageData.nativeWidth;
            const h = imageData.nativeHeight;
            const s = imageData.scaleFactor;
            
            resizeContainer(w * s, h * s);
            resizeCanvas(w, h, s);
        }

        const resetDisplay = () => {
            resizeContainer(INITIAL_WIDTH, INITIAL_HEIGHT);
            resizeCanvas(INITIAL_WIDTH, INITIAL_HEIGHT);            
        }
        
        if (imageState) {
            fitDisplayToImage(imageState)
            drawImageToCanvas(imageState.rawData);
        } else {
            clearCanvas()
            resetDisplay()
        }

    },[imageState, canvasRef, containerRef])

    //Marker Elements 
    const markerElements = markersState.map((marker, i) => {
        return <Marker 
            key={marker.id}
            containerData={containerData}
            marker={marker}
            markersDispatch={markersDispatch}
            fontWeight={textSettingsState.fontWeight}
            hideBorder={hideBorder}
        />
    })

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
                </div>
                <div className='display-canvas-container' ref={containerRef}>
                    <PrescriptionMarker containerData={containerData} hideBorder={hideBorder} />
                    {markerElements}
                    <canvas className='display-canvas' ref={canvasRef} />
                </div>
            </div>
            <ReactToPrint 
                trigger={() => <button>Print this out!</button>}
                content={() => containerRef.current}
            />
        </div>
    );
};

export default Display;
