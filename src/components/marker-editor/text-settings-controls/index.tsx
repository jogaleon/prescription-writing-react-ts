import { useContext, useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";

import TextSettingsContext, { TextSettingsContextType } from "../../../context/text-settings-context/TextSettingsContext";
import TextSettings from "../../../types/state/textSettings";

interface ITextSettingsControlsProps {
}

const TextSettingsControls: React.FunctionComponent<ITextSettingsControlsProps> = (props) => {
    const {textSettingsState, textSettingsDispatch} = useContext(TextSettingsContext) as TextSettingsContextType
    const [input, setInput] = useState(textSettingsState)
    const debouncedInput = useDebounce(input);

    useEffect(() => {
       setInput(textSettingsState) 
    },[textSettingsState])

    useEffect(() => {
        textSettingsDispatch({type: 'SAVE_TEXT_SETTINGS', payload: debouncedInput})
    },[debouncedInput, textSettingsDispatch])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInput(prevInput => {
            return {
                ...prevInput,
                [e.target.name]: e.target.value
            }
        })
    }
  return (
    <div className="TextSettingsControls">
        <h2>Text Settings Controls</h2>
        <label htmlFor="globalTextSize">Global Text Size:</label>
        <input type="number" name="globalTextSize" value={input.globalTextSize} onChange={handleInputChange} />
        <label htmlFor="color">Color:</label>
        <input type="color" name="color" value={input.color} onChange={handleInputChange} />
        <label htmlFor="fontWeight">Font Weight: </label>
        <select name="fontWeight" value={input.fontWeight} onChange={handleInputChange}>
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
        </select>
    </div>
  );
};

export default TextSettingsControls;
