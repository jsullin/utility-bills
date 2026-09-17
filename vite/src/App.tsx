
import { Routes, Route, Link } from 'react-router-dom';
import './App.css'
import BillsTable from './Pages/BillsTable';
import Portals from './Pages/Portals';



function App() {
  return (
    <div>
      <nav>
        <Link to="/">Bills</Link>
        {' | '}
        <Link to="/portals">Portals</Link>
      </nav>

      <Routes>
        <Route path="/" element={<BillsTable />} />
        <Route path="/portals" element={<Portals />} />

      </Routes>
    </div>
  );
}

export default App;