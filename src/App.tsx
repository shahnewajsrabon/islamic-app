import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';
import Quran from './pages/Quran';
import QuranReader from './pages/QuranReader';
import Qibla from './pages/Qibla';
import DuaPage from './pages/Dua';
import AllahNames from './pages/AllahNames';
import Tasbih from './pages/Tasbih';
import ZakatCalculator from './pages/Zakat';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="prayer-times" element={<PlaceholderPage title="Prayer Times" />} />
          <Route path="quran" element={<Quran />} />
          <Route path="quran/:number" element={<QuranReader />} />
          <Route path="qibla" element={<Qibla />} />
          <Route path="dua" element={<DuaPage />} />
          <Route path="names-of-allah" element={<AllahNames />} />
          <Route path="tasbih" element={<Tasbih />} />
          <Route path="zakat" element={<ZakatCalculator />} />
          <Route path="*" element={<PlaceholderPage title="404 Not Found" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
