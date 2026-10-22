import express from 'express';
import  {db} from '../db'
import { requireFields } from '../middleware/authorization';


const router = express.Router()


router.get('/get_all_bills', (req, res) => {
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
router.post('/add_bill', requireFields(['year', 'month', 'company_guid', 'amount']), (req, res) => {
  const { year, month, company_guid, amount } = req.body;

  db.prepare(`
    INSERT INTO bills (year, month, company_guid, amount)
    VALUES (?, ?, ?, ?)
  `).run(year, month, company_guid, amount);

  res.json({ success: true });
});

// Delete Bill

router.delete('/delete_bill/:id', (req, res) => {
    const { id } = req.params

    const result = db.prepare(`
        DELETE FROM bills WHERE bill_guid = ?    
    `).run(id)
    

    if (result.changes ===0) {
        return res.status(404).json({error: 'Bill not found'})
    }
    res.json({ success: true });
});

export default router;

