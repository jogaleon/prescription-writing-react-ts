import { useState, useEffect, useContext } from "react";
import throttle from "../global-utils/throttle";

import { BoundaryBox } from './../types/boundaryBox';

const useDraggableMarker = (el: React.MutableRefObject<HTMLDivElement | null>, savePosition: (x: number, y: number) => void, startX: number, startY: number, boundaryBox: BoundaryBox) => {
  const [{ x, y }, setPosition] = useState({ x: startX, y: startY });
  const [isDragging, setIsDragging] = useState(false);
  

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
        if (!target || Array.from(target.classList).includes('marker-resize-handle')) return 
        const offsetX = e.clientX - target.getBoundingClientRect().left;
        const offsetY = e.clientY - target.getBoundingClientRect().top;
        
        const dragging = (e: MouseEvent) => {
          const newX = e.clientX - offsetX + window.scrollX;
          const newY = e.clientY - offsetY + window.scrollY;

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
  }, [el, boundaryBox]);

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
    savePosition(x, y);

  },[isDragging, savePosition])
}

export default useDraggableMarker;
