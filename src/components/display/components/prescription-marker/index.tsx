import { useContext, useCallback, useRef } from 'react';
import useDraggableMarker from '../../../../hooks/useDraggableMarker';
import useResizeMarker from '../../../../hooks/useResizableMarker';

import { IElementDataState } from '../../../../hooks/useElement';

import '../../style.css';
import './style.css';
import { PrescriptionMarkerActionType } from '../../../../context/prescription-marker-context/PrescriptionMarkerContext';
import TextSettingsContext, { TextSettingsContextType } from '../../../../context/text-settings-context/TextSettingsContext';
import PrescriptionMarkerItem from './prescription-marker-item';
import PrescriptionMarkerData from '../../../../types/state/prescriptionMarkerData';
import PrescriptionData from '../../../../types/state/prescriptionData';

interface IPrescriptionMarkerProps {
  prescriptionMarker: PrescriptionMarkerData
  prescriptionMarkersDispatch: React.Dispatch<PrescriptionMarkerActionType>
  prescriptionList: PrescriptionData[]
  containerData: IElementDataState
  hideGuidelines: boolean
}

const PrescriptionMarker: React.FunctionComponent<IPrescriptionMarkerProps> = ({prescriptionMarker, prescriptionMarkersDispatch, prescriptionList, containerData, hideGuidelines}) => {
  const markerStyle = {
    border: `thin ${hideGuidelines ? 'rgba(0,0,0,0)' : 'red'} solid`
  }
  const {textSettingsState} = useContext(TextSettingsContext) as TextSettingsContextType;
  // console.log(prescriptionMarker.x)
  const markerRef = useRef<HTMLDivElement | null>(null);
  const markerResizeHandleRef = useRef<HTMLDivElement | null>(null);

  const saveMarkerPosition = useCallback((x: number, y: number) => {
    prescriptionMarkersDispatch({type: 'SAVE_PRESCRIPTION_MARKER_POSITION', payload: {
      id: prescriptionMarker.id,
      newX: x,
      newY: y
    }})
  },[prescriptionMarkersDispatch, prescriptionMarker.id])

  const saveMarkerDimensions = useCallback((w: number, h: number) => {
    prescriptionMarkersDispatch({type: 'SAVE_PRESCRIPTION_MARKER_DIMENSIONS', payload: {
      id: prescriptionMarker.id,
      newW: w,
      newH: h
    }})    
  },[prescriptionMarkersDispatch, prescriptionMarker.id])

  

  useDraggableMarker(
    markerRef, 
    saveMarkerPosition, 
    prescriptionMarker.x, 
    prescriptionMarker.y, 
    {
      sX: containerData.positionX,
      sY: containerData.positionY,
      eX: containerData.positionX + containerData.width,
      eY: containerData.positionY + containerData.height
    }
  )
    
  useResizeMarker(
    markerResizeHandleRef, 
    saveMarkerDimensions, 
    prescriptionMarker.width, 
    prescriptionMarker.height, 
    containerData.positionX + containerData.width, 
    containerData.positionY + containerData.height
  )
  const prescriptionMarkerItemElements = prescriptionList.map(prescription => {
    return <PrescriptionMarkerItem
      key={prescription.id}
      textSize={textSettingsState.prescriptionTextSize}
      color={textSettingsState.color}
      fontWeight={textSettingsState.fontWeight}
      prescription={prescription}
    />
  })
  
  return (
    <div className='Marker' style={markerStyle} ref={markerRef}>
      <div className='prescription-marker-cover' />
      <p className={`marker-label${hideGuidelines ? ' hidden' : ''}`}>Prescription List</p>
      <div className='prescription-marker-text-container'>
        {prescriptionMarkerItemElements}
      </div>
      <div className={`marker-resize-handle wh${hideGuidelines ? ' hidden' : ''}`} ref={markerResizeHandleRef}></div>
    </div>
  );
};

export default PrescriptionMarker;

