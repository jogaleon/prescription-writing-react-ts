import { useContext } from 'react';
import MarkerContext, { MarkerContextType } from '../../context/marker-context/MarkerContext';
import MarkerEditorItem from './components/marker-editor-item';

interface IMarkerEditorProps {
}

const MarkerEditor: React.FunctionComponent<IMarkerEditorProps> = (props) => {
    const {markersState, markersDispatch} = useContext(MarkerContext) as MarkerContextType;
    const markerEditorItemElements = markersState.map(marker => {
        return <MarkerEditorItem
            key={marker.id} 
            marker={marker}
            markersDispatch={markersDispatch}
        />
    })
    return (
        <div className="MarkerEditor">
            {markerEditorItemElements}
        </div>
    );
};

export default MarkerEditor;
