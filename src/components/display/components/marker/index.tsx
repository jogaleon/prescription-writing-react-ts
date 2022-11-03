import { useCallback, useRef } from 'react';
import useDraggableMarker from '../../../../hooks/useDraggableMarker';
import useResizeWidthMarker from '../../../../hooks/useResizableWidthMarker';

import { IElementDataState } from '../../../../hooks/useElement';
import MarkerData from '../../../../types/state/markerData';

import { MarkerActionType } from '../../../../context/marker-context/MarkerContext';

import '../../style.css';

interface IMarkerProps {
  containerData: IElementDataState
  marker: MarkerData
  markersDispatch: React.Dispatch<MarkerActionType>
  color: string
  fontWeight: string
  hideGuidelines: boolean
}

const Marker: React.FunctionComponent<IMarkerProps> = ({containerData, marker, markersDispatch, color, fontWeight, hideGuidelines}) => {
  const markerStyle = {
    height: `${marker.textSize}px`,
    border: `thin ${hideGuidelines ? 'rgba(0,0,0,0)' : 'red'} solid`
  }

  const markerTextStyle = {
    color: color,
    fontSize: `${marker.textSize}px`,
    fontWeight: fontWeight
  }

  const markerRef = useRef<HTMLDivElement | null>(null);
  const markerResizeHandleRef = useRef<HTMLDivElement | null>(null);

  const saveMarkerPosition = useCallback((x: number, y: number) => {
    markersDispatch({type: 'SAVE_MARKER_POSITION', payload: {
      id: marker.id,
      newX: x,
      newY: y
    }});
  }, [markersDispatch])

  const saveMarkerDimensions = useCallback((w: number) => {
    markersDispatch({type: 'SAVE_MARKER_DIMENSIONS', payload: {
      id: marker.id,
      newW: w
    }});
  }, [markersDispatch])

  useDraggableMarker(markerRef, saveMarkerPosition, marker.x, marker.y, {
    sX: containerData.positionX,
    sY: containerData.positionY,
    eX: containerData.positionX + containerData.width,
    eY: containerData.positionY + containerData.height
  })

  useResizeWidthMarker(markerResizeHandleRef, saveMarkerDimensions, marker.width, containerData.positionX + containerData.width)
  
  return (
    <div className='Marker' style={markerStyle} ref={markerRef}>
      <p className={`marker-label${hideGuidelines ? ' hidden' : ''}`}>{marker.label}</p>
      <div className='marker-text' style={markerTextStyle}>{marker.text}</div>
      <div className={`marker-resize-handle w${hideGuidelines ? ' hidden' : ''}`} ref={markerResizeHandleRef}></div>
    </div>
  );
};

export default Marker;

