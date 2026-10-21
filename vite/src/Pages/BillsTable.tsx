import { useState, useEffect } from 'react'

interface Bill {
  bill_guid: string;
  year: number;
  month: number;
  amount: number;
  name: string;
  type: string;
  url: string;
}

interface Company {
  company_guid: string;
  name: string;
  type: string;
  url: string;
}


function BillsTable() {
  // Company Search Filter Variables
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


  // Clear Filters Variable
  const clearFilters = () => {
    setSearch('');
    setYearFilter('All');
    setMonthFilter('All');
    setTypeFilter('All');
  };

  // Show Add Bill Popup;
  const [showAddBillModal, setShowAddBillModal] = useState(false)

  // New Bill Object
  const [newBill, setNewBill] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    company_guid: '',
    amount: '',
    name: '',
    type: ''
  });

  // Company lookup variable for Add Bill Modal
  const [companies, setCompanies] = useState<Company[]>([]);

  // Submit Function
  const handleBill = async () => {
    const response = await fetch('http://localhost:3001/api/add_bill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBill)
    })

    if (response.ok) {
      // Refresh the Bill List
      const data = await fetch('http://localhost:3001/api/get_all_bills')
        .then(r => r.json());
      setBills(data);
      setShowAddBillModal(false)
    }
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/get_all_bills')
      .then(response => response.json())
      .then(data => setBills(data))
      .catch(error => console.error('Error fetching bills:', error));

    fetch('http://localhost:3001/api/get_all_portals')
      .then(response => response.json())
      .then(data => setCompanies(data))
      .catch(error => console.error('Error fetching companies: ', error));
  }, []);

  const filteredBills = bills.filter(bill =>
    bill.name.toLowerCase().includes(search.toLowerCase()) &&
    (yearFilter === 'All' || bill.year === Number(yearFilter)) &&
    (monthFilter === 'All' || bill.month === Number(monthFilter)) &&
    (typeFilter === 'All' || bill.type === typeFilter)
  );

  return (
    <div>
      <header>
        <h1>Utility Billing Automation</h1>
        <h2>Utility Bills</h2>
        <button onClick={() => setShowAddBillModal(true)} style={{marginBottom: '10px'}}>Add Bill</button>
      </header>

      <main>
        <table>
          <thead>
            {/* Row 1: column labels only */}
            <tr className="label-row">
              <th><span className="col-label">Year</span></th>
              <th><span className="col-label">Month</span></th>
              <th><span className="col-label">Company</span></th>
              <th><span className="col-label">Type</span></th>
              <th><span className="col-label">Amount</span></th>
            </tr>

            {/* Row 2: filter controls only */}
            <tr className="filter-row">
              <th>
                <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                  <option>All</option>
                  {uniqueYears.map(year => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </th>
              <th>
                <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
                  <option>All</option>
                  {uniqueMonths.map(month => (
                    <option key={month}>{month}</option>
                  ))}
                </select>
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search by company..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </th>
              <th>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option>All</option>
                  {uniqueTypes.map(type => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </th>
              <th>
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

        {showAddBillModal && (
          <div className="modal-overlay">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Add New Bill</h3>

              <h5 style={{margin: 0}}>Year</h5>
              <input type="number" placeholder="Year" value={newBill.year}
                onChange={e => setNewBill({ ...newBill, year: Number(e.target.value) })} />

              <h5 style={{margin: 0}}>Month</h5>
              <input type="number" placeholder="Month" value={newBill.month}
                onChange={e => setNewBill({ ...newBill, month: Number(e.target.value) })} />

              <h5 style={{margin: 0}}>Company</h5>
              <select
                value={newBill.company_guid}
                onChange={(e => setNewBill({ ...newBill, company_guid: e.target.value }))}
              >
                <option value="">Select a Company</option>
                {companies.map(company => (
                  <option key={company.company_guid} value={company.company_guid}>
                    {company.name}
                  </option>
                ))}
              </select>


              <h5 style={{margin: 0}}>Amount</h5>
              <input type="number" placeholder="Amount" value={newBill.amount}
                onChange={e => setNewBill({ ...newBill, amount: e.target.value })} />


              <button onClick={handleBill}>Save</button>
              <button onClick={() => setShowAddBillModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default BillsTable;