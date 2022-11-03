import './style.css';

interface IPrescriptionMarkerItemProps {
    textSize: string
    color: string
    fontWeight: string
    medicineName: string
    dosage: string
    type: string
    quantity: string
    directions: string
}
 
const PrescriptionMarkerItem: React.FunctionComponent<IPrescriptionMarkerItemProps> = ({textSize, color, fontWeight, medicineName, dosage, type, quantity, directions}) => {
    const prescriptionMarkerItemStyle = {
        color: color,
        fontSize: `${textSize}px`,
        fontWeight: fontWeight
    }

    return (
    <div style={prescriptionMarkerItemStyle} className="PrescriptionMarkerItem">
        <p className="marker-text">
            <span>•{medicineName}</span>
            <span>({dosage}/{type})</span>
            <span>#{quantity}</span>
        </p>
        <p className="marker-text">S. {directions}</p>
    </div>
  );
};

export default PrescriptionMarkerItem;
