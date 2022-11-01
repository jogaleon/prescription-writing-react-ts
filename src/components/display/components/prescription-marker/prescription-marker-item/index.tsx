import './style.css';

interface IPrescriptionMarkerItemProps {
    textSize: string
    medicineName: string
    dosage: string
    type: string
    quantity: string
    directions: string
}
 
const PrescriptionMarkerItem: React.FunctionComponent<IPrescriptionMarkerItemProps> = ({textSize, medicineName, dosage, type, quantity, directions}) => {
    const prescriptionMarkerItemStyle = {
        fontSize: `${textSize}px`
    }

    return (
    <div style={prescriptionMarkerItemStyle} className="PrescriptionMarkerItem">
        <p className="prescription-marker-text-line1">{medicineName} ({dosage}/{type}) #{quantity}</p>
        <p className="prescription-marker-text-line2">S. {directions}</p>
    </div>
  );
};

export default PrescriptionMarkerItem;
