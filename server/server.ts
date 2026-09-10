import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';

const app = express();
app.use(cors());

const db = new Database('../data/utility_bills.db');

app.get('/api/get_all_bills', (req, res) => {
  const bills = db.prepare(`
    SELECT
    a.bill_guid,
	a.year,
	a.month,
	a.amount,
	b.type,
	b.name,
	b.url
	
    FROM bills a
    LEFT JOIN utility_companies b
    ON a.company_guid = b.company_guid
    ORDER BY a.year desc, a.month desc, type asc

    `).all();
  res.json(bills);
});

app.listen(3001, () => console.log('Server running on port 3001'));