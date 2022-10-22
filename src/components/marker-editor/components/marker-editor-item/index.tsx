import React, { useCallback, useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import { MarkerData } from "../../../../types/state/markerData";

import './style.css';

interface IMarkerEditorItemProps {
    marker: MarkerData
}

interface IInputState {
    label: string,
    text: string
    textSize: string
}

const MarkerEditorItem: React.FunctionComponent<IMarkerEditorItemProps> = (props) => {
    const [input, setInput] = useState({
        label: '',
        text: '',
        textSize: ''
    })
    const debouncedInput = useDebounce(input);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(prevInput => {
            console.log(e.target.name, e.target.value)
            return {
                ...prevInput,
                [e.target.name]: e.target.value
            }
        })
    }

  return (
    <div className="MarkerEditorItem">
        <label htmlFor="input-label">Label: </label>
        <input name="label" className="input-label" type="text" onChange={handleInputChange} />
        <label htmlFor="input-text">Text: </label>
        <input name="text" className="input-text" type="text" onChange={handleInputChange} />
        <label htmlFor="input-text">Size: </label>
        <input name="fontSize" className="input-text-size" type="number" onChange={handleInputChange} />
        
    </div>
  );
};

export default MarkerEditorItem;
