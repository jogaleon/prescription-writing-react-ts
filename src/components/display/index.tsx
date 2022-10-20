import { useState, useEffect, useRef, useContext } from 'react';
import readFile from './utils/readFile';
import dataToImage from './utils/dataToImage';
import calculateScale from './utils/calculateScale';

import { ImageData } from '../../types/state/imageData';
import { DisplayData } from '../../types/state/displayData';
import { MarkerData } from '../../types/state/markerData';

import Marker from './components/marker';

import MarkerContext, { MarkerContextType } from '../../context/MarkerContext';

import './style.css'

interface IDisplayProps {
    width: number
    height: number
}

const MAX_WIDTH = 1000;

const Display: React.FunctionComponent<IDisplayProps> = () => {
    const {markersState, markersDispatch} = useContext(MarkerContext) as MarkerContextType;

    const [imageData, setImageData] = useState<ImageData|null>(null);
    const [displayData, setDisplayData] = useState<DisplayData>({
        positionX: 0,
        positionY: 0,
        width: 0,
        height: 0
    });

    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const containerRef = useRef<HTMLDivElement|null>(null);

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

        const fitDisplayToImage = (imageData: ImageData, canvas: HTMLCanvasElement, container: HTMLDivElement) => {
            const w = imageData.nativeWidth;
            const h = imageData.nativeHeight;
            const s = imageData.scaleFactor;
            
            // console.log(w)
            canvas.width = w;
            canvas.height = h;
            // canvas.style.transform = `scale(${s})`;
            
            container.style.width = `${w * s}px`;
            container.style.height = `${h * s}px`;
        }

        const drawImageToCanvas = async (imageData: ImageData, canvas: HTMLCanvasElement) => {
            const imageElement = await dataToImage(imageData.rawData);
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(imageElement, 0,0);
           

        }

        fitDisplayToImage(imageData, canvas, container);
        setDisplayData(prevDisplayData => ({
            ...prevDisplayData,
            width: container.offsetWidth,
            height: container.offsetHeight
        }))
        drawImageToCanvas(imageData, canvas);
    },[imageData])

    //Get display x, y position and initial w,h
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return
        setDisplayData({
            positionX: container.getBoundingClientRect().left,
            positionY: container.getBoundingClientRect().top,
            width: container.offsetWidth,
            height: container.offsetHeight
        })
    },[])
    //Marker Elements 

    const markerElements = markersState.map(marker => {
        return <Marker 
            displayData={displayData}
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
        </div>
    );
};

export default Display;
