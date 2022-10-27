import { useContext, useMemo, useCallback, useRef } from 'react';
import useDraggableMarker from '../../../../hooks/useDraggableMarker';
import useResizeWidthMarker from '../../../../hooks/useResizableWidthMarker';
import useResizeMarker from '../../../../hooks/useResizableMarker';

import { IElementDataState } from '../../../../hooks/useElement';
import MarkerData from '../../../../types/state/markerData';

import '../marker/style.css';
import PrescriptionMarkerContext, { PrescriptionMarkerContextType } from '../../../../context/prescription-marker-context/PrescriptionMarkerContext';

interface IPrescriptionMarkerProps {
  containerData: IElementDataState
}

const PrescriptionMarker: React.FunctionComponent<IPrescriptionMarkerProps> = ({containerData}) => {
  const {prescriptionMarkerState, prescriptionMarkerDispatch} = useContext(PrescriptionMarkerContext) as PrescriptionMarkerContextType;
  const {x, y, width, height} = useMemo(() => prescriptionMarkerState,[prescriptionMarkerState])
  // const markerStyle = {
  //   height: `${marker.textSize}px`,
  // }
  // const markerTextStyle = {
  //   fontSize: `${marker.textSize}px`,
  //   fontWeight: fontWeight
  // }

  const markerRef = useRef<HTMLDivElement | null>(null);
  const markerResizeHandleRef = useRef<HTMLDivElement | null>(null);

  const saveMarkerPosition = useCallback((x: number, y: number) => {
    prescriptionMarkerDispatch({type: 'SAVE_PRESCRIPTION_MARKER_POSITION', payload: {
      newX: x,
      newY: y
    }})
  },[prescriptionMarkerDispatch])

  const saveMarkerDimensions = useCallback((w: number, h: number) => {
    prescriptionMarkerDispatch({type: 'SAVE_PRESCRIPTION_MARKER_DIMENSIONS', payload: {
      newW: w,
      newH: h
    }})    
  },[prescriptionMarkerDispatch])

  useDraggableMarker(markerRef, saveMarkerPosition, x, y, {
    sX: containerData.positionX,
    sY: containerData.positionY,
    eX: containerData.positionX + containerData.width,
    eY: containerData.positionY + containerData.height
  })
  
  useResizeMarker(markerResizeHandleRef, saveMarkerDimensions, width, height, containerData.positionX + containerData.width, containerData.positionY + containerData.height)
  return (
    <div className='Marker'  ref={markerRef}>
      <p className='marker-label'>Prescription Marker</p>
      <div className='marker-text'></div>
      <div className='marker-resize-handle wh' ref={markerResizeHandleRef}></div>
    </div>
  );
};

export default PrescriptionMarker;

