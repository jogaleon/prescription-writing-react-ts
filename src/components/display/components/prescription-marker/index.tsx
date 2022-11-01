import { useContext, useMemo, useCallback, useRef } from 'react';
import useDraggableMarker from '../../../../hooks/useDraggableMarker';
import useResizeMarker from '../../../../hooks/useResizableMarker';

import { IElementDataState } from '../../../../hooks/useElement';

import '../marker/style.css';
import './style.css';
import PrescriptionMarkerContext, { PrescriptionMarkerContextType } from '../../../../context/prescription-marker-context/PrescriptionMarkerContext';
import TextSettingsContext, { TextSettingsContextType } from '../../../../context/text-settings-context/TextSettingsContext';
import PrescriptionMarkerText from './prescription-marker-text';
import PrescriptionListContext, { PrescriptionListContextType } from '../../../../context/prescription-list-context/PrescriptionListContext';

interface IPrescriptionMarkerProps {
  containerData: IElementDataState
}

const PrescriptionMarker: React.FunctionComponent<IPrescriptionMarkerProps> = ({containerData}) => {
  const {prescriptionMarkerState, prescriptionMarkerDispatch} = useContext(PrescriptionMarkerContext) as PrescriptionMarkerContextType;
  const {prescriptionListState} = useContext(PrescriptionListContext) as PrescriptionListContextType
  const {textSettingsState} = useContext(TextSettingsContext) as TextSettingsContextType;
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

  const prescriptionMarkerTextElements = prescriptionListState.map(prescription => {
    return <PrescriptionMarkerText 
      textSize={textSettingsState.prescriptionTextSize}
      medicineName={prescription.medicineName}
      dosage={prescription.dosage}
      type={prescription.type}
      quantity={prescription.quantity}
      directions={prescription.directions}
    />
  })
  
  useResizeMarker(markerResizeHandleRef, saveMarkerDimensions, width, height, containerData.positionX + containerData.width, containerData.positionY + containerData.height)
  return (
    <div className='Marker'  ref={markerRef}>
      <p className='marker-label'>Prescription List</p>
      <div className='prescription-marker-text-container'>
        {prescriptionMarkerTextElements}
      </div>
      <div className='marker-resize-handle wh' ref={markerResizeHandleRef}></div>
    </div>
  );
};

export default PrescriptionMarker;

