import { useState, useEffect, useContext, Ref } from "react";
import MarkerContext, { MarkerContextType } from "../context/MarkerContext";
import { ImageData } from "../types/state/imageData";
// import MarkerContext from "../../context/MarkerContext";

type BoundaryBox = {
  sX: number
  sY: number
  eX: number
  eY: number
}

const useDraggableMarker = (el: React.MutableRefObject<HTMLDivElement | null>, markerId: string, startX: number, startY: number, boundaryBox: BoundaryBox) => {
  const [{ x, y }, setPosition] = useState({ x: startX, y: startY });
  const markerContext = useContext(MarkerContext) as MarkerContextType

  useEffect(() => {
    const marker = el.current;
    if (!marker) return

    const {sX, sY, eX, eY} = boundaryBox;
    const dragStart = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLDivElement
        if (!target) return
        if (!Array.from(target.classList).includes('Marker')) return
        const offsetX = e.clientX - target.getBoundingClientRect().left;
        const offsetY = e.clientY - target.getBoundingClientRect().top;
        
        const dragging = (e: MouseEvent) => {
          const newX = e.clientX - offsetX;
          const newY = e.clientY - offsetY;
          // console.log(newX, eX)
          if (newX < sX || newX > eX - marker.offsetWidth) return
          if (newY < sY || newY > eY- marker.offsetHeight) return
          setPosition({
              x: newX - sX,
              y: newY - sY
          });
        };

        const dragEnd = (e: MouseEvent) => {
          console.log(markerContext)
        // markerContext.markersDispatch({type: 'SAVE_POSITION', payload: {
        //     id: markerId,
        //     newX: e.clientX - offsetX,
        //     newY: e.clientY - offsetY
        // }})
        document.removeEventListener("mousemove", dragging);
        };

        document.addEventListener("mousemove", dragging);
        document.addEventListener("mouseup", dragEnd, { once: true });
    };

    marker.addEventListener("mousedown", dragStart);

    return () => {
      marker.removeEventListener("mousedown", dragStart);
    };
  }, [el, markerId, x, y, boundaryBox, markerContext]);

  useEffect(() => {
    const marker = el.current
    if (!marker) return
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
  }, [el, x, y]);
}

export default useDraggableMarker;
