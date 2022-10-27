import { useRef } from 'react';
import useDraggableMarker from '../../../../hooks/useDraggableMarker';
import useResizeWidthMarker from '../../../../hooks/useResizableWidthMarker';
import useResizeMarker from '../../../../hooks/useResizableMarker';

import { IElementDataState } from '../../../../hooks/useElement';
import MarkerData from '../../../../types/state/markerData';

import '../marker/style.css';

interface IPrescriptionMarkerProps {
  containerData: IElementDataState
}

const PrescriptionMarker: React.FunctionComponent<IPrescriptionMarkerProps> = ({containerData}) => {
  // const markerStyle = {
  //   height: `${marker.textSize}px`,
  // }
  // const markerTextStyle = {
  //   fontSize: `${marker.textSize}px`,
  //   fontWeight: fontWeight
  // }

  const markerRef = useRef<HTMLDivElement | null>(null);
  const markerResizeHandleRef = useRef<HTMLDivElement | null>(null);

  useDraggableMarker(markerRef, '', 0, 0, {
    sX: containerData.positionX,
    sY: containerData.positionY,
    eX: containerData.positionX + containerData.width,
    eY: containerData.positionY + containerData.height
  })
  // useResizeWidthMarker(markerResizeHandleRef, '', 50, containerData.positionX + containerData.width)
  useResizeMarker(markerResizeHandleRef, '', 50, 50, containerData.positionX + containerData.width, containerData.positionY + containerData.height)
  return (
    <div className='Marker'  ref={markerRef}>
      <p className='marker-label'>Prescription Marker</p>
      <div className='marker-text'></div>
      <div className='marker-resize-handle wh' ref={markerResizeHandleRef}></div>
    </div>
  );
};

export default PrescriptionMarker;

