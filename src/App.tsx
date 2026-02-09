import { Routes, Route } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { LanguageProvider } from './contexts/LanguageContext';
import { UDLDataProvider } from './contexts/UDLDataContext';
import { SearchProvider } from './contexts/SearchContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { UIProvider } from './contexts/UIContext';
import Home from './routes/Home';
import Model from './routes/Model';
import Explorer from './routes/Explorer';
import Detail from './routes/Detail';
import './app.css';

function App() {
  return (
    <LanguageProvider>
      <UDLDataProvider>
        <SearchProvider>
          <SettingsProvider>
            <UIProvider>
              <Tooltip.Provider delayDuration={300}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/model" element={<Model />} />
                  <Route path="/explore" element={<Explorer />} />
                  <Route path="/detail/:id" element={<Detail />} />
                </Routes>
              </Tooltip.Provider>
            </UIProvider>
          </SettingsProvider>
        </SearchProvider>
      </UDLDataProvider>
    </LanguageProvider>
  );
}

export default App;
