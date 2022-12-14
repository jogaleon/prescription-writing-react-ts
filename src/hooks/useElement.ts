import { useState, useEffect, useRef, useCallback } from 'react';

export interface IElementDataState {
    positionX: number,
    positionY: number,
    width: number
    height: number
    scale?: number
}

const useElement = <T extends HTMLElement>(initialWidth: number, initialHeight: number, initialScale?: number): [
    React.MutableRefObject<T|null>,
    IElementDataState,
    (newWidth: number, newHeight: number, newScale?: number) => void

] => {
    const elementRef = useRef<T|null>(null);
    const [elementData, setElementData] = useState<IElementDataState>({
        positionX: 0,
        positionY: 0,
        width: (initialWidth >= 0) ? initialWidth : 0, 
        height: (initialHeight >= 0) ? initialHeight : 0, 
        scale: (initialScale) ? initialScale : undefined
    })
    
    const resizeElement = useCallback((newWidth: number, newHeight: number, newScale?: number) => {
        setElementData(prevElementData => ({
            ...prevElementData,
            width: newWidth, 
            height: newHeight,
            scale: (newScale) ? newScale : prevElementData.scale
        }))
    },[]);

    //Fetching element position
    useEffect(() => {
        const element = elementRef.current
        if (!element) return;

        setElementData(prevElementData => ({
            ...prevElementData,
            positionX: element.getBoundingClientRect().left + window.scrollX,
            positionY: element.getBoundingClientRect().top + window.scrollY
        }))
    },[elementRef, elementData.width, elementData.height])
    
    //Setting element width
    useEffect(() => {
        const element = elementRef.current
        if (!element) return;

        element.style.width = `${elementData.width}px`;
        element.style.height = `${elementData.height}px`;

        if (elementData.scale) element.style.transform = `scale(${elementData.scale})`;
    },[elementRef, elementData])

    return [elementRef, elementData, resizeElement]
}

export default useElement