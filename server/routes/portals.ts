import express from 'express'
import {db} from '../db'
import {requireStringFields, requireFields} from '../middleware/authorization'

const router = express.Router()

router.get('/api/get_all_portals', (req, res) => {
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




router.patch('/api/update_portal/:id', requireStringFields(['type', 'name', 'url']), (req, res) => {
  const { id } = req.params;
  const { type, name, url } = req.body;

  db.prepare(`
    UPDATE utility_companies
    SET type = ?, name = ?, url = ?
    WHERE company_guid = ?
  `).run(type, name, url, id);

  res.json({ success: true });
});



// Add Portal
router.post('/api/add_portal', requireFields(['type', 'name', 'url']), (req, res) => {
  const { type, name, url } = req.body

  db.prepare(`
    INSERT INTO utility_companies (type, name, url)
    VALUES (?, ?, ?)
  `).run(type, name, url)

  res.json({ success: true });
});

// Delete Portal
router.delete('/api/delete_portal/:id', (req, res) => {
  const { id } = req.params;

  const result = db.prepare(`
      DELETE FROM utility_companies
      WHERE company_guid = ?
    `).run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Portal not found'})
  }

  res.json({ success: true });
});