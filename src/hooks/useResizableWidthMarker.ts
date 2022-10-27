import MARKER_SETTINGS from "../settings/markerSettings";
import { useState, useEffect } from "react";

const useResizeWidthMarker = (el: React.MutableRefObject<HTMLDivElement | null>, saveDimensions: (w: number) => void, startWidth: number, boundaryX: number) => {
    const [width, setWidth] = useState(startWidth);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        setWidth(startWidth)
    },[startWidth]);
    
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

        const resizing = (e: MouseEvent) => {
            setWidth(prevWidth => {
                const newW = prevWidth + (e.movementX * 1.2);
                return (newW + offsetX > boundaryX || newW <=  MARKER_SETTINGS.MIN_WIDTH) ? prevWidth : newW
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
    }, [el, boundaryX]);

    useEffect(() => {
        const resizeHandle = el.current
        if (!resizeHandle) return
        const marker = resizeHandle.parentNode as HTMLElement
        if (!marker) throw new Error('Resize handle must have a parent element')
        marker.style.width = `${width}px`;
    }, [el, width]);

    useEffect(() => {
        saveDimensions(width)
    },[isResizing, saveDimensions])
}

export default useResizeWidthMarker;