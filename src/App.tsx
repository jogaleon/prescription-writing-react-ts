import './App.css';
import { ImageContextProvider } from './context/image-context/ImageContext';
import { MarkerContextProvider } from './context/marker-context/MarkerContext';
import { ProfileContextProvider } from './context/profile-context/ProfileContext';
import { TextSettingsContextProvider } from './context/text-settings-context/TextSettingsContext';
import Main from './views/main';


const App = () => {
  return (
    <div className="App">
      <ProfileContextProvider>
        <TextSettingsContextProvider>
          <ImageContextProvider>
            <MarkerContextProvider>
              <Main />
            </MarkerContextProvider>
          </ImageContextProvider>
        </TextSettingsContextProvider>
      </ProfileContextProvider>
    </div>
  );
}

export default App;
