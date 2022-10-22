import { useState, useEffect, useContext } from "react";
import throttle from "../global-utils/throttle";

import { BoundaryBox } from './../types/boundaryBox';

import MarkerContext, { MarkerContextType } from "../context/marker-context/MarkerContext";

const useDraggableMarker = (el: React.MutableRefObject<HTMLDivElement | null>, markerId: string, startX: number, startY: number, boundaryBox: BoundaryBox) => {
  const [{ x, y }, setPosition] = useState({ x: startX, y: startY });
  const [isDragging, setIsDragging] = useState(false);
  const {markersDispatch} = useContext(MarkerContext) as MarkerContextType;
  

  useEffect(() => {
    setPosition({ x: startX, y: startY })
  },[startX, startY])

  //Dragging logic
  useEffect(() => {
    const marker = el.current;
    if (!marker) return

    const {sX, sY, eX, eY} = boundaryBox;
    const dragStart = (e: MouseEvent) => {
        setIsDragging(true);

        const target = e.target as HTMLDivElement
        if (!target || !Array.from(target.classList).includes('Marker')) return 

        const offsetX = e.clientX - target.getBoundingClientRect().left;
        const offsetY = e.clientY - target.getBoundingClientRect().top;
        
        const dragging = (e: MouseEvent) => {
          const newX = e.clientX - offsetX;
          const newY = e.clientY - offsetY;

          if (newX < sX || newX > eX - marker.offsetWidth) return
          if (newY < sY || newY > eY - marker.offsetHeight) return
          
          setPosition({
              x: newX - sX,
              y: newY - sY
          });
        };

        const dragEnd = (e: MouseEvent) => {
          setIsDragging(false)
          document.removeEventListener("mousemove", dragging);
        };

        document.addEventListener("mousemove", dragging);
        document.addEventListener("mouseup", dragEnd, { once: true });
    };

    marker.addEventListener("mousedown", dragStart);

    return () => {
      marker.removeEventListener("mousedown", dragStart);
    };
  }, [el, boundaryBox, markersDispatch]);

  //Set marker element position
  useEffect(() => {
    const marker = el.current
    if (!marker) return
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
  }, [el, x, y]);

  //Saving new position to state (x and y deps are intentionally omitted)
  useEffect(() => {
    if (isDragging) return
    markersDispatch({type: 'SAVE_POSITION', payload: {
      id: markerId,
      newX: x,
      newY: y
    }})
  },[markerId, isDragging, markersDispatch])
}

export default useDraggableMarker;
