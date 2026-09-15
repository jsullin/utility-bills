
import { Routes, Route, Link } from 'react-router-dom';
import './App.css'
import AddBill from './Pages/AddBill';
import BillsTable from './Pages/BillsTable';



function App() {
  return (
    <div>
      <nav>
        <Link to="/">Bills</Link>
        {' | '}
        <Link to="/add-bill">Add Bill</Link>
      </nav>

      <Routes>
        <Route path="/" element={<BillsTable />} />
        <Route path="/add-bill" element={<AddBill />} />

      </Routes>
    </div>
  );
}

export default App;