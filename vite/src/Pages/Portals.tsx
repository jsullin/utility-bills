import { useState, useEffect } from 'react'

interface Portal {
  company_guid: string;
  type: string;
  name: string;
  url: string;
}

function Portals() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/get_all_portals')
      .then(response => response.json())
      .then(data => setPortals(data))
      .catch(error => console.error('Error fetching portals:', error));
  }, []);

  function updateField(id: string, field: keyof Portal, value: string) {
    setPortals(portals.map(p =>
      p.company_guid === id ? { ...p, [field]: value } : p
    ));
  }

  function saveRow(portal: Portal) {
    fetch(`http://localhost:3001/api/update_portal/${portal.company_guid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(portal),
    })
      .then(() => setEditingId(null))
      .catch(error => console.error('Error saving:', error));
  }

  return (
    <div>
      <header>
        <h1>Utility Billing Automation</h1>
        <h2>Utility Bills</h2>
      </header>

      <main>
        <table>
          <thead>
            <tr className="label-row">
              <th><span className="col-label">Type</span></th>
              <th><span className="col-label">Company</span></th>
              <th><span className="col-label">Portal</span></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {portals.map(portal => {
              const isEditing = editingId === portal.company_guid;
              return (
                <tr key={portal.company_guid}>
                  <td>
                    {isEditing
                      ? <input value={portal.type} onChange={e => updateField(portal.company_guid, 'type', e.target.value)} />
                      : portal.type}
                  </td>
                  <td>
                    {isEditing
                      ? <input value={portal.name} onChange={e => updateField(portal.company_guid, 'name', e.target.value)} />
                      : portal.name}
                  </td>
                  <td>
                    {isEditing
                      ? <input value={portal.url} onChange={e => updateField(portal.company_guid, 'url', e.target.value)} />
                      : <a href={portal.url} target="_blank" rel="noopener noreferrer">Portal</a>}
                  </td>
                  <td>
                   {isEditing
                      ? <button onClick={() => saveRow(portal)}>Save</button>
                      : <button onClick={() => setEditingId(portal.company_guid)}>Edit</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default Portals;