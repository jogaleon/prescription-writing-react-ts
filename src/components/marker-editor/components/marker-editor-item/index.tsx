import React, { useEffect, useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";

import MarkerData from "../../../../types/state/markerData";
import { MarkerActionType } from "../../../../context/marker-context/MarkerContext";

import './style.css';

interface IMarkerEditorItemProps {
    marker: MarkerData
    markersDispatch: React.Dispatch<MarkerActionType>
    globalTextSize: string
}

interface IInputState {
    label: string,
    text: string
    textSize: string
}

const MarkerEditorItem: React.FunctionComponent<IMarkerEditorItemProps> = ({marker, markersDispatch, globalTextSize}) => {
    const [isTextLocked, setIsTextLocked] = useState(false)
    const [input, setInput] = useState<IInputState>({
        label: marker.label,
        text: marker.text,
        textSize: marker.textSize
    })
    const debouncedInput = useDebounce(input);
    useEffect(() => {
        if (isTextLocked) setInput(prevInput => ({
            ...prevInput,
            textSize: globalTextSize
        }))
    },[isTextLocked, globalTextSize])

    useEffect(() => {
        markersDispatch({type: 'EDIT_MARKER', payload: {
            id: marker.id, 
            label: debouncedInput.label, 
            text: debouncedInput.text,
            textSize: debouncedInput.textSize
        }})
    },[debouncedInput, marker.id, markersDispatch])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(prevInput => {
            // console.log(e.target.name, e.target.value)
            return {
                ...prevInput,
                [e.target.name]: e.target.value
            }
        })
    }

    const toggleTextLock = () => {
        setIsTextLocked(prevIsTextLocked => !prevIsTextLocked)
    }

  return (
    <div className="MarkerEditorItem">
        {/* <label htmlFor="input-label">Label: </label> */}
        <input type="text" name="label" className="input-label" value={input.label} onChange={handleInputChange} />
        <label htmlFor="input-text">Text: </label>
        <input type="text" name="text" className="input-text" value={input.text} onChange={handleInputChange} />
        <label htmlFor="input-text">Size: </label>
        <input type="number" name="textSize" className="input-text-size" value={input.textSize} disabled={isTextLocked} onChange={handleInputChange} />
        <button onClick={toggleTextLock}>{isTextLocked ? 'Unlock Size' : 'Lock Size'}</button>
        <button onClick={() => markersDispatch({type: 'DELETE_MARKER', payload: {id: marker.id}})}>Delete Marker</button>
    </div>
  );
};

export default MarkerEditorItem;
