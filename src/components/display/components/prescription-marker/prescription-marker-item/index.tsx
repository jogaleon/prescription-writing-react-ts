import PrescriptionData from '../../../../../types/state/prescriptionData';
import './style.css';

interface IPrescriptionMarkerItemProps {
    textSize: number
    color: string
    fontWeight: string
    prescription: PrescriptionData
}
 
const PrescriptionMarkerItem: React.FunctionComponent<IPrescriptionMarkerItemProps> = ({textSize, color, fontWeight, prescription}) => {
    const prescriptionMarkerItemStyle = {
        color: color,
        fontSize: `${textSize}px`,
        fontWeight: fontWeight
    }

    return (
    <div style={prescriptionMarkerItemStyle} className="PrescriptionMarkerItem">
        <p className="marker-text">
            <span>•{prescription.medicineName}</span>
            <span>({prescription.dosage}/{prescription.type})</span>
            <span>#{prescription.quantity}</span>
        </p>
        <p className="marker-text">S. {prescription.directions}</p>
    </div>
  );
};

export default PrescriptionMarkerItem;
