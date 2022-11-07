import { useContext } from 'react';
import PrescriptionListContext, { PrescriptionListContextType } from '../../context/prescription-list-context/PrescriptionListContext';
import TextSettingsContext, { TextSettingsContextType } from '../../context/text-settings-context/TextSettingsContext';
import PrescriptionListEditorItem from './prescription-list-editor-item';
import './style.css';

interface IPrescriptionListEditorProps {
}

const PrescriptionListEditor: React.FunctionComponent<IPrescriptionListEditorProps> = (props) => {
  const {prescriptionListState, prescriptionListDispatch, splitPrescriptionId, saveSplitPrescriptionId} = useContext(PrescriptionListContext) as PrescriptionListContextType;
  const {textSettingsState} = useContext(TextSettingsContext) as TextSettingsContextType;
  const prescriptionListEditorItemElements = prescriptionListState.map(prescription => {
    return (
      <PrescriptionListEditorItem
        key={prescription.id}
        prescription={prescription}
        prescriptionListDispatch={prescriptionListDispatch}
        prescriptionTextSize={textSettingsState.prescriptionTextSize}
        splitPrescritionId={splitPrescriptionId}
        saveSplitPrescriptionId={saveSplitPrescriptionId}
      />
    )
  })
  return (
    <div className="PrescriptionListEditor">
        <h1>Prescription List Editor</h1>
        <button onClick={() => prescriptionListDispatch({type:'ADD_PRESCRIPTION'})}>Add Prescription</button>
        <button onClick={() => prescriptionListDispatch({type: 'CLEAR_PRESCRIPTION_LIST'})}>Clear Prescription List</button>
        <div className="prescription-list-editor-item-container">
          {prescriptionListEditorItemElements}
        </div>
    </div>
  );
};

export default PrescriptionListEditor;
