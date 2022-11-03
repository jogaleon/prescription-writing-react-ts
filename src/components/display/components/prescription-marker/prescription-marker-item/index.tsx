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
        <p className="marker-text">{medicineName} ({dosage}/{type}) #{quantity}</p>
        <p className="marker-text">S. {directions}</p>
    </div>
  );
};

export default PrescriptionMarkerItem;
