import './App.css';
import { ImageContextProvider } from './context/image-context/ImageContext';
import { MarkerContextProvider } from './context/marker-context/MarkerContext';
import { PrescriptionListContextProvider } from './context/prescription-list-context/PrescriptionListContext';
import { PrescriptionMarkerContextProvider } from './context/prescription-marker-context/PrescriptionMarkerContext';
import { ProfileContextProvider } from './context/profile-context/ProfileContext';
import { TextSettingsContextProvider } from './context/text-settings-context/TextSettingsContext';
import Main from './views/main';


const App = () => {
  return (
    <div className="App">
      <ProfileContextProvider>
        <TextSettingsContextProvider>
          <ImageContextProvider>
            <PrescriptionListContextProvider>
              <MarkerContextProvider>
                <PrescriptionMarkerContextProvider>
                  <Main />
                </PrescriptionMarkerContextProvider>
              </MarkerContextProvider>
            </PrescriptionListContextProvider>
          </ImageContextProvider>
        </TextSettingsContextProvider>
      </ProfileContextProvider>
    </div>
  );
}

export default App;
