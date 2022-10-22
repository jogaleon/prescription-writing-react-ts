import { useState, useEffect, useContext } from 'react';
import useElement from '../../hooks/useElement';
import useCanvas from '../../hooks/useCanvas';

import readFile from './utils/readFile';
import dataToImage from './utils/dataToImage';
import calculateScale from './utils/calculateScale';

import { ImageData } from '../../types/state/imageData';

import Marker from './components/marker';

import MarkerContext, { MarkerContextType } from '../../context/marker-context/MarkerContext';

import './style.css'

interface IDisplayProps {
    width: number
    height: number
}

const MAX_WIDTH = 800;
const INITIAL_WIDTH = 300;
const INITIAL_HEIGHT = 300;

const Display: React.FunctionComponent<IDisplayProps> = () => {
    const {markersState, markersDispatch} = useContext(MarkerContext) as MarkerContextType;
    const [imageData, setImageData] = useState<ImageData|null>(null);

    const [canvasRef, resizeCanvas, drawImageToCanvas] = useCanvas(INITIAL_WIDTH, INITIAL_HEIGHT);
    const [containerRef, containerData, resizeContainer] = useElement<HTMLDivElement>(INITIAL_WIDTH, INITIAL_HEIGHT);

    const handleInputFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const data = await readFile(e.target.files[0]);
        const image = await dataToImage(data);
        setImageData({
            rawData: data,
            nativeWidth: image.width,
            nativeHeight: image.height,
            scaleFactor: calculateScale(MAX_WIDTH, image.width, 3)
        })
    }

    //
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !imageData) return;
        markersDispatch({type:'RESET_MARKERS'});
        const fitDisplayToImage = (imageData: ImageData) => {
            const w = imageData.nativeWidth;
            const h = imageData.nativeHeight;
            const s = imageData.scaleFactor;
            
            resizeContainer(w * s, h * s);
            resizeCanvas(w, h, s);
        }

        fitDisplayToImage(imageData)
        drawImageToCanvas(imageData.rawData);

    },[imageData, canvasRef, containerRef])

    //Marker Elements 
    const markerElements = markersState.map((marker, i) => {
        return <Marker 
            key={marker.id}
            containerData={containerData}
            marker={marker}
        />
    })

    return (
        <div className='Display'>
            <input 
                type="file"
                accept='image/png, image/jpeg'
                onChange={handleInputFile}
            />
            <div className='display-canvas-container' ref={containerRef}>
                {markerElements}
                <canvas className='display-canvas' ref={canvasRef} />
            </div>
            <button onClick={() => markersDispatch({type:'ADD_MARKER'})}>Add Marker</button>
            <button onClick={() => markersDispatch({type: 'CLEAR_MARKERS'})}>Clear Markers</button>
            <button onClick={() => markersDispatch({type: 'RESET_MARKERS'})}>Reset Markers</button>
        </div>
    );
};

export default Display;
