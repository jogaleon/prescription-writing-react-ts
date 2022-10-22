import dataToImage from '../components/display/utils/dataToImage';

import { useRef, useCallback, useEffect } from 'react';
const useCanvas = (initialWidth: number, initialHeight: number):[
    React.MutableRefObject<HTMLCanvasElement | null>,
    (width: number, height: number, scale?: number) => void,
    (rawImageData: string) => Promise<void>
] => {
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    console.log("canvas")
    
    const resizeCanvas = useCallback((width: number, height: number, scale?: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return

        canvas.width = width;
        canvas.height = height;
        if (scale) canvas.style.transform = `scale(${scale})`
    },[canvasRef])

    const drawImageToCanvas = useCallback(async (rawImageData: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const imageElement = await dataToImage(rawImageData);
        ctx.drawImage(imageElement, 0,0);
    },[canvasRef]);

    useEffect(() => {
        resizeCanvas(initialWidth, initialHeight)
    },[initialWidth, initialHeight, resizeCanvas])

    
    return [canvasRef, resizeCanvas, drawImageToCanvas]
}

export default useCanvas