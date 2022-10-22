import './App.css';
import { MarkerContextProvider } from './context/marker-context/MarkerContext';
import Main from './views/main';


const App = () => {
  return (
    <div className="App">
      <MarkerContextProvider>
        <Main />
      </MarkerContextProvider>
    </div>
  );
}

export default App;
