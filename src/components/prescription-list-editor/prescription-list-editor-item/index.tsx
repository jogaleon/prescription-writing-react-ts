import { useState, useEffect } from 'react';
import { PrescriptionListActionType } from '../../../context/prescription-list-context/PrescriptionListContext';
import useDebounce from '../../../hooks/useDebounce';
import PrescriptionData from '../../../types/state/prescriptionData';
import './style.css';

interface IPrescriptionListItemProps {
  prescription: PrescriptionData
  prescriptionListDispatch: React.Dispatch<PrescriptionListActionType>
  splitPrescritionId: string | null
  saveSplitPrescriptionId: (id: string) => void
  prescriptionTextSize: string
}

const PrescriptionListEditorItem: React.FunctionComponent<IPrescriptionListItemProps> = ({
  prescription, 
  prescriptionListDispatch, 
  splitPrescritionId,
  saveSplitPrescriptionId, 
  prescriptionTextSize
}) => {
  const [input, setInput] = useState({
    medicineName: prescription.medicineName,
    dosage: prescription.dosage,
    type: prescription.type,
    quantity: prescription.quantity,
    directions: prescription.directions   
  })
  const debouncedInput = useDebounce(input);

  useEffect(() => {
    prescriptionListDispatch({type: 'EDIT_PRESCRIPTION', payload: {id: prescription.id, prescription: input}})
  },[debouncedInput])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(prevInput => {
        // console.log(e.target.name, e.target.value)
        return {
            ...prevInput,
            [e.target.name]: e.target.value
        }
    })
  }
  return (
    <div className="PrescriptionListEditorItem">
        <div className="input-container">
          <label htmlFor="input-medicineName">Medicine: </label>
          <input type="text" name="medicineName" className="input-medicineName" value={input.medicineName} onChange={handleInputChange} />
        </div>

        <div className="input-container">
          <label htmlFor="input-dosage">Dosage: </label>
          <input type="text" name="dosage" className="input-dosage" value={input.dosage} onChange={handleInputChange} />
        </div>

        <div className="input-container">
          <label htmlFor="input-type">Type: </label>
          <input type="text" name="type" className="input-type" value={input.type} onChange={handleInputChange} />
        </div>

        <div className="input-container">
          <label htmlFor="input-quantity">Quantity: </label>
          <input type="text" name="quantity" className="input-quantity" value={input.quantity} onChange={handleInputChange} />
        </div>

        <div className="button-container">
          <button className="button-delete" onClick={() => prescriptionListDispatch({type: 'DELETE_PRESCRIPTION', payload: {id: prescription.id}})}>Del</button>
          <button className="button-delete" onClick={() => saveSplitPrescriptionId(prescription.id)}>{splitPrescritionId === prescription.id ? 'Unsplit' : 'Split'}</button>
        </div>

        <div className="input-container-directions">
          <label htmlFor="input-directions">Directions: </label>
          <input type="text" name="directions" className="input-directions" value={input.directions} onChange={handleInputChange} />
        </div>

    </div>
  );
};

export default PrescriptionListEditorItem;
