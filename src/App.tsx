import './App.css';
import { ImageContextProvider } from './context/image-context/ImageContext';
import { MarkerContextProvider } from './context/marker-context/MarkerContext';
import { ProfileContextProvider } from './context/profile-context/ProfileContext';
import Main from './views/main';


const App = () => {
  return (
    <div className="App">
      <ProfileContextProvider>
        <ImageContextProvider>
          <MarkerContextProvider>
            <Main />
          </MarkerContextProvider>
        </ImageContextProvider>
      </ProfileContextProvider>
    </div>
  );
}

export default App;
