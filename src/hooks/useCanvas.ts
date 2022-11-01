import { useRef, useCallback, useEffect } from 'react';
import dataToImage from '../components/display/utils/dataToImage';

const useCanvas = (initialWidth: number, initialHeight: number):[
    React.MutableRefObject<HTMLCanvasElement | null>,
    (width: number, height: number, scale?: number) => void,
    (rawImageData: string) => Promise<void>,
    (x: number, y: number, text: string, size: number, color: string, weight: string, scale: number, maxWidth?: number) => void,
    () => void
] => {
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    
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

    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
    },[canvasRef])

    const writeText = (x: number, y: number, text: string, size: number, color: string, weight: string, scale: number, maxWidth?: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;            
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.textBaseline = 'top';
        ctx.font = `${(weight === 'bold') ? 'bold ' : ''}${size / scale}px Arial`;
        console.log(ctx.font)
        ctx.fillText (text, x / scale, y / scale);
    }

    useEffect(() => {
        resizeCanvas(initialWidth, initialHeight)
    },[initialWidth, initialHeight, resizeCanvas])

    
    return [canvasRef, resizeCanvas, drawImageToCanvas, writeText, clearCanvas]
}

export default useCanvas