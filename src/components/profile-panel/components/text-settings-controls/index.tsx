import React, { useContext, useEffect, useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";

import TextSettingsContext, { TextSettingsContextType } from "../../../../context/text-settings-context/TextSettingsContext";

import './style.css';
import TextSettings from "../../../../types/state/textSettings";

interface ITextSettingsControlsProps {
}

const TextSettingsControls: React.FunctionComponent<ITextSettingsControlsProps> = (props) => {
    const {textSettingsState, textSettingsDispatch} = useContext(TextSettingsContext) as TextSettingsContextType

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        textSettingsDispatch({type:'EDIT_TEXT_SETTINGS', payload: {[e.target.name]: e.target.value}})
    }

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        textSettingsDispatch({type:'EDIT_TEXT_SETTINGS', payload: {[e.target.name]: parseFloat(e.target.value)}})
    }

  return (
    <div className="TextSettingsControls">
        {/* <h2>Text Settings Controls</h2> */}
        <label htmlFor="markerGlobalTextSize">Marker Global Text Size:</label>
        <input type="number" name="markerGlobalTextSize" min="0" value={textSettingsState.markerGlobalTextSize} onChange={handleSizeChange} />
        <label htmlFor="prescriptionTextSize">Prescription Text Size:</label>
        <input type="number" name="prescriptionTextSize" min="0" value={textSettingsState.prescriptionTextSize} onChange={handleSizeChange} />
        <label htmlFor="color">Color:</label>
        <input type="color" name="color" value={textSettingsState.color} onChange={handleInputChange} />
        <label htmlFor="fontWeight">Font Weight: </label>
        <select name="fontWeight" value={textSettingsState.fontWeight} onChange={handleInputChange}>
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
        </select>
    </div>
  );
};

export default TextSettingsControls;
