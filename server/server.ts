import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';

const app = express();

// CORS: only your frontend can call this API
app.use(cors({ origin: 'http://localhost:5173' })); // update to match your Vite dev server

app.use(express.json());

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

app.get('/api/get_all_portals', (req, res) => {
  const portals = db.prepare(`
    SELECT
    company_guid,
    type,
    name,
    url
    FROM utility_companies
    ORDER BY type asc

    `).all();
  res.json(portals);
});

// Reusable validation helper — pass the field names that must be present, non-empty strings
function requireStringFields(fields: string[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    for (const field of fields) {
      if (typeof req.body[field] !== 'string' || req.body[field].trim() === '') {
        return res.status(400).json({ error: `Missing or invalid field: ${field}` });
      }
    }
    next();
  };
}

app.patch('/api/update_portal/:id', requireStringFields(['type', 'name', 'url']), (req, res) => {
  const { id } = req.params;
  const { type, name, url } = req.body;

  db.prepare(`
    UPDATE utility_companies
    SET type = ?, name = ?, url = ?
    WHERE company_guid = ?
  `).run(type, name, url, id);

  res.json({ success: true });
});


app.listen(3001, () => console.log('Server running on port 3001'));