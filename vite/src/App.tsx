import { useState, useEffect } from 'react'
import './App.css'

interface Bill {
  bill_guid: string;
  year: number;
  month: number;
  amount: number;
  name: string;
  type: string;
  url: string;
}

function App() {
  // Comapny Search Filter Variables
  const [bills, setBills] = useState<Bill[]>([]);
  const [search, setSearch] = useState('');

  // Year Filter Variables
  const uniqueYears = [...new Set(bills.map(bill => bill.year))].sort();
  const [yearFilter, setYearFilter] = useState('All');

  // Month Filter Variables
  const uniqueMonths = [...new Set(bills.map(bill => bill.month))].sort();
  const [monthFilter, setMonthFilter] = useState('All');

  // Type Filter Variables
  const uniqueTypes = [...new Set(bills.map(bill => bill.type))].sort();
  const [typeFilter, setTypeFilter] = useState('All');

  // Ammount Filter Variables
  const uniqueAmounts = [...new Set(bills.map(bill => bill.amount))].sort();
  const [amountFilter, setAmountFilter] = useState('All');

  // Clear Filters Variable
  const clearFilters = () => {
    setSearch('');
    setYearFilter('All');
    setMonthFilter('All');
    setTypeFilter('All');
    setAmountFilter('All');
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/get_all_bills')
      .then(response => response.json())
      .then(data => setBills(data))
      .catch(error => console.error('Error fetching bills:', error));
  }, []);

  const filteredBills = bills.filter(bill =>
    bill.name.toLowerCase().includes(search.toLowerCase()) &&
    (yearFilter === 'All' || bill.year === Number(yearFilter)) &&
    (monthFilter === 'All' || bill.month === Number(monthFilter)) &&
    (typeFilter === 'All' || bill.type === typeFilter) &&
    (amountFilter === 'All' || bill.amount === Number(amountFilter))
  );

  return (
    <div>
        <header> 
          <h1>Utility Billing Automation</h1>
          <h2>Utility Bills</h2>
        </header>

        <main>
          <table>
            <thead>
              <tr>
                <th>
                  Year<br />
                  {/* Year Filter */}
                  <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                    <option>All</option>
                    {uniqueYears.map(year => (
                      <option key={year}>{year}</option>
                    ))}
                  </select>
                </th>
                <th>
                  Month<br />
                  {/* Month Filter */}
                  <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
                    <option>All</option>
                    {uniqueMonths.map(month => (
                      <option key={month}>{month}</option>
                    ))}
                  </select>
                </th>
                <th>
                  Company<br />
                  {/* Company Search Filter */}
                  <input
                    type="text"
                    placeholder="Search by company..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </th>
                <th>
                  Type<br />
                  {/* Bill Type Filter */}
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option>All</option>
                    {uniqueTypes.map(type => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </th>
                <th>
                  Amount<br />
                  {/* Clear Filters */}
                  <button onClick={clearFilters}>Clear Filters</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map(bill => (
                <tr key={bill.bill_guid}>
                  <td>{bill.year}</td>
                  <td>{bill.month}</td>
                  <td>{bill.name}</td>
                  <td>{bill.type}</td>
                  <td>{bill.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
    </div>
  )
}

export default App