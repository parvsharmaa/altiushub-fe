import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MiniDrawer from './components/Base';
import Invoice from './components/Invoice';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <MiniDrawer />
      <Routes>
        <Route exact to='/' element={<Home />} />
        <Route to='invoices' element={<Invoice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
