import formatPrescriptionText from '../../../../../global-utils/formatPrescriptionEntry';
import './style.css';

interface IPrescriptionMarkerTextProps {
    textSize: string
    medicineName: string
    dosage: string
    type: string
    quantity: string
    directions: string
}
 
const PrescriptionMarkerText: React.FunctionComponent<IPrescriptionMarkerTextProps> = ({textSize, medicineName, dosage, type, quantity, directions}) => {
    const prescriptionMarkerTextStyle = {
        fontSize: `${textSize}px`
    }
    const [line1, line2] = formatPrescriptionText(medicineName, dosage, type, quantity, directions)
    
    return (
    <div style={prescriptionMarkerTextStyle} className="PrescriptionMarkerText">
        <p className="prescription-marker-text-line1">{line1}</p>
        <p className="prescription-marker-text-line2">{line2}</p>
    </div>
  );
};

export default PrescriptionMarkerText;
