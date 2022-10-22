import { useState, useEffect, useRef, useContext } from 'react';
import readFile from './utils/readFile';
import dataToImage from './utils/dataToImage';
import calculateScale from './utils/calculateScale';

import { ImageData } from '../../types/state/imageData';
import { DisplayData } from '../../types/state/displayData';

import Marker from './components/marker';

import MarkerContext, { MarkerContextType } from '../../context/marker-context/MarkerContext';

import './style.css'
import useElementSize from '../../hooks/useElementSize';
import useCanvas from '../../hooks/useCanvas';

interface IDisplayProps {
    width: number
    height: number
}

const MAX_WIDTH = 1000;
const INITIAL_WIDTH = 300;
const INITIAL_HEIGHT = 300;

const Display: React.FunctionComponent<IDisplayProps> = () => {
    const {markersState, markersDispatch} = useContext(MarkerContext) as MarkerContextType;

    const [imageData, setImageData] = useState<ImageData|null>(null);
    // const [displayData, setDisplayData] = useState<DisplayData>({
    //     positionX: 0,
    //     positionY: 0,
    //     width: 0,
    //     height: 0
    // });

    // const canvasRef = useRef<HTMLCanvasElement|null>(null);
    // const containerRef = useRef<HTMLDivElement|null>(null);
    // const [canvasRef, canvasSize, setCanvasSize] = useElementSize<HTMLCanvasElement>(INITIAL_WIDTH, INITIAL_HEIGHT);
    const [canvasRef, resizeCanvas, drawImageToCanvas] = useCanvas(INITIAL_WIDTH, INITIAL_HEIGHT);
    const [containerRef, containerData, resizeContainer] = useElementSize<HTMLDivElement>(INITIAL_WIDTH, INITIAL_HEIGHT);

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

        const fitDisplayToImage = (imageData: ImageData) => {
            const w = imageData.nativeWidth;
            const h = imageData.nativeHeight;
            const s = imageData.scaleFactor;
            
            // setCanvasSize({width: w, height: h})
            // setContainerSize({width: w * s, height: h * s})
            // canvas.width = w;
            // canvas.height = h;
            // canvas.style.transform = `scale(${s})`;
            
            // container.style.width = `${w * s}px`;
            // container.style.height = `${h * s}px`;
            resizeContainer(w * s, h * s);
            resizeCanvas(w, h, s);
        }

        fitDisplayToImage(imageData)
        drawImageToCanvas(imageData.rawData);

        
        // fitDisplayToImage(imageData, canvas, container);
        // setDisplayData(prevDisplayData => ({
        //     ...prevDisplayData,
        //     width: container.offsetWidth,
        //     height: container.offsetHeight
        // }))
    },[imageData, canvasRef, containerRef])

    //Get display x, y position and initial w,h

    // useEffect(() => {
    //     const container = containerRef.current;
    //     if (!container) return
    //     setDisplayData({
    //         positionX: container.getBoundingClientRect().left,
    //         positionY: container.getBoundingClientRect().top,
    //         width: container.offsetWidth,
    //         height: container.offsetHeight
    //     })
    // },[containerRef])

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
            Display
            <input 
                type="file"
                accept='image/png, image/jpeg'
                onChange={handleInputFile}
            />
            <div className='canvas-container' ref={containerRef}>
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
