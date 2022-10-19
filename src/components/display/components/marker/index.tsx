import { useRef } from 'react';
import useDraggableMarker from '../../../../hooks/useDraggableMarker';
import { DisplayData } from '../../../../types/state/displayData';
import './style.css';

interface IMarkerProps {
  displayData: DisplayData
}

const Marker: React.FunctionComponent<IMarkerProps> = ({displayData}) => {
  const markerRef = useRef<HTMLDivElement | null>(null);
  
  useDraggableMarker(markerRef, '', 0, 0, {
    sX: displayData.positionX,
    sY: displayData.positionY,
    eX: displayData.positionX + displayData.width,
    eY: displayData.positionY + displayData.height
  })
  return (
    <div ref={markerRef} className='Marker'>

    </div>
  );
};

export default Marker;

