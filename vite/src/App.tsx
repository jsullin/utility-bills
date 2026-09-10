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
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/get_all_bills')
      .then(response => response.json())
      .then(data => setBills(data))
      .catch(error => console.error('Error fetching bills:', error));
  }, []);

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
                <th>Year</th>
                <th>Month</th>
                <th>Company</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
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
