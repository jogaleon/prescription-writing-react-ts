import { useContext } from 'react';
import MarkerContext, { MarkerContextType } from '../../context/marker-context/MarkerContext';
import TextSettingsContext, { TextSettingsContextType } from '../../context/text-settings-context/TextSettingsContext';
import MarkerEditorItem from './components/marker-editor-item';

import './style.css';
import TextSettingsControls from '../profile-panel/components/text-settings-controls';

interface IMarkerEditorProps {
}

const MarkerEditor: React.FunctionComponent<IMarkerEditorProps> = (props) => {
    const {markersState, markersDispatch} = useContext(MarkerContext) as MarkerContextType;
    const {textSettingsState} = useContext(TextSettingsContext) as TextSettingsContextType;
    
    const markerEditorItemElements = markersState.map(marker => {
        return <MarkerEditorItem
            key={marker.id} 
            marker={marker}
            markersDispatch={markersDispatch}
            globalTextSize={textSettingsState.markerGlobalTextSize}
        />
    })
    return (
        <div className="MarkerEditor">
            <h1>Marker Editor</h1>
            <button onClick={() => markersDispatch({type:'ADD_MARKER'})}>Add Marker</button>
            <button onClick={() => markersDispatch({type: 'CLEAR_MARKERS'})}>Clear Markers</button>
            <button onClick={() => markersDispatch({type: 'RESET_MARKERS'})}>Reset Markers</button>
            <div className="marker-editor-item-container">
                {markerEditorItemElements}
            </div>
        </div>
    );
};

export default MarkerEditor;
