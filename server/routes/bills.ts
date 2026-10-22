
import express from 'express';
import  {db} from '../db'
import { requireFields } from '../middleware/authorization';


const router = express.Router()


router.get('/api/get_all_bills', (req, res) => {
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

// Add Bill
router.post('/api/add_bill', requireFields(['year', 'month', 'company_guid', 'amount']), (req, res) => {
  const { year, month, company_guid, amount } = req.body;

  db.prepare(`
    INSERT INTO bills (year, month, company_guid, amount)
    VALUES (?, ?, ?, ?)
  `).run(year, month, company_guid, amount);

  res.json({ success: true });
});

export default router;

