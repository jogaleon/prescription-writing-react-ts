import { useState, useEffect, useRef } from 'react';
import readFile from './utils/readFile';
import dataToImage from './utils/dataToImage';

import './style.css'

interface IDisplayProps {
    width: number
    height: number
}

const SCALE_FACTOR = 0.3;

const Display: React.FunctionComponent<IDisplayProps> = ({width, height}) => {
    const CANVAS_STYLE = {
        width: width,
        height: height
    }
    const [scaleFactor, setScaleFactor] = useState(1);
    const [imageData, setImageData] = useState<string|null>(null);
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const containerRef = useRef<HTMLDivElement|null>(null);

    const handleInputFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const data = await readFile(e.target.files[0]);
        const image = await dataToImage(data);

        setImageData(data)
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !imageData) return;

        const drawImageToCanvas = async (imageData: string, canvas: HTMLCanvasElement, canvasContainer: HTMLDivElement) => {
            const imageElement = await dataToImage(imageData);
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            canvas.width = imageElement.naturalWidth;
            canvas.height = imageElement.naturalHeight;
    
            ctx.drawImage(imageElement, 0,0);
    
            container.style.width = `${imageElement.naturalWidth * SCALE_FACTOR}px`;
            container.style.height = `${imageElement.naturalHeight * SCALE_FACTOR}px`;
            
            // ctx.drawImage(imageElement, 0,0);
            canvas.style.transform = `scale(${SCALE_FACTOR})`;
        }

        drawImageToCanvas(imageData, canvas, container)
    },[imageData])
    
    return (
        <div className='Display'>
            Display
            <input 
                type="file"
                accept='image/png, image/jpeg'
                onChange={handleInputFile}
            />
            <div className='canvas-container' ref={containerRef}>
                <canvas style={CANVAS_STYLE} className='display-canvas' ref={canvasRef} />
            </div>
        </div>
    );
};

export default Display;
