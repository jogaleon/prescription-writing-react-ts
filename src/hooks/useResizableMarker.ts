import MARKER_SETTINGS from "../settings/markerSettings";
import { useState, useEffect, useContext } from "react";

import MarkerContext, { MarkerContextType } from '../context/marker-context/MarkerContext';

const useResizeMarker = (el: React.MutableRefObject<HTMLDivElement | null>, markerId: string, startWidth: number, startHeight: number, boundaryX: number, boundaryY: number) => {
    const [{w, h}, setDimensions] = useState({w: startWidth, h: startHeight});
    const [isResizing, setIsResizing] = useState(false);
    const { markersDispatch } = useContext(MarkerContext) as MarkerContextType;

    // useEffect(() => {
    //     setDimensions({w: startWidth, h: startHeight})
    // },[startWidth, startHeight]);
    
    useEffect(() => {
    const resizeHandle = el.current
    if (!resizeHandle) return

    const resizeStart = (e: MouseEvent) => {
        setIsResizing(true)

        const target = e.target as HTMLDivElement
        const marker = target.parentNode as HTMLElement
        if (!marker) throw new Error('Resize handle must have a parent element')
        if (!target || !Array.from(target.classList).includes('marker-resize-handle')) return

        const offsetX = marker.getBoundingClientRect().left + window.scrollX;
        const offsetY = marker.getBoundingClientRect().top + window.scrollY;

        const resizing = (e: MouseEvent) => {
            setDimensions(prevDimensions => {
                const newW = prevDimensions.w + (e.movementX * 1.2);
                const newH = prevDimensions.h + (e.movementY * 1.2);
                // console.log((newH + offsetY > boundaryY || newH <=  MARKER_SETTINGS.MIN_HEIGHT))
                // console.log(newH + offsetY, boundaryY)
                return {
                    w:(newW + offsetX > boundaryX || newW <=  MARKER_SETTINGS.MIN_WIDTH) ? prevDimensions.w : newW,
                    h:(newH + offsetY > boundaryY || newH <=  MARKER_SETTINGS.MIN_HEIGHT) ? prevDimensions.h : newH
                }
                
            });
        };

        const resizeEnd = (e: MouseEvent) => {
            setIsResizing(false)
            document.removeEventListener("mousemove", resizing);
        };

        document.addEventListener("mousemove", resizing);
        document.addEventListener("mouseup", resizeEnd, { once: true });
    };

    resizeHandle.addEventListener("mousedown", resizeStart);

    return () => {
        resizeHandle.removeEventListener("mousedown", resizeStart);
    };
    }, [el, boundaryX, boundaryY, markersDispatch]);

    useEffect(() => {
        const resizeHandle = el.current
        if (!resizeHandle) return
        const marker = resizeHandle.parentNode as HTMLElement
        if (!marker) throw new Error('Resize handle must have a parent element')
        marker.style.width = `${w}px`;
        marker.style.height = `${h}px`
    }, [el, w, h]);

    // useEffect(() => {
    //     markersDispatch({type: 'SAVE_MARKER_DIMENSIONS', payload: {
    //         id: markerId,
    //         newW: width,
    //     }})
    // },[markerId, isResizing, markersDispatch])
}

export default useResizeMarker;