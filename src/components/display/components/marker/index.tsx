import { useRef } from 'react';
import useDraggableMarker from '../../../../hooks/useDraggableMarker';
import useResizeWidthMarker from '../../../../hooks/useResizableWidthMarker';

import { IElementDataState } from '../../../../hooks/useElement';
import MarkerData from '../../../../types/state/markerData';

import './style.css';

interface IMarkerProps {
  containerData: IElementDataState
  marker: MarkerData
  fontWeight: string
}

const Marker: React.FunctionComponent<IMarkerProps> = ({containerData, marker, fontWeight}) => {
  const markerStyle = {
    height: `${marker.textSize}px`,
  }
  const markerTextStyle = {
    fontSize: `${marker.textSize}px`,
    fontWeight: fontWeight
  }

  const markerRef = useRef<HTMLDivElement | null>(null);
  const markerResizeHandleRef = useRef<HTMLDivElement | null>(null);

  useDraggableMarker(markerRef, marker.id, marker.x, marker.y, {
    sX: containerData.positionX,
    sY: containerData.positionY,
    eX: containerData.positionX + containerData.width,
    eY: containerData.positionY + containerData.height
  })
  useResizeWidthMarker(markerResizeHandleRef, marker.id, marker.width, containerData.positionX + containerData.width)
  return (
    <div className='Marker' style={markerStyle} ref={markerRef}>
      <p className='marker-label'>{marker.label}</p>
      <div className='marker-text' style={markerTextStyle}>{marker.text}</div>
      <div className='marker-resize-handle w' ref={markerResizeHandleRef}></div>
    </div>
  );
};

export default Marker;

