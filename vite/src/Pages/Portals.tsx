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

  // Show add Portal Modal
  const [showAddPortalModal, setShowAddPortalModal] = useState(false)

  // New Portal Object
  const [newPortal, setNewPortal] = useState({
    type: '',
    name: '',
    url: '',
  })

  // Submit new portal function
  const handlePortal = async () => {
    const response = await fetch('http://localhost:3001/api/add_portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPortal)
    })

    if (response.ok) {
      // Refresh the portal list
      const data = await fetch('http://localhost:3001/api/get_all_portals')
        .then(r => r.json());
      setPortals(data);
      setShowAddPortalModal(false)
    }
  }

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

  // Delete Bill Function
  const deletePortal = async (company_guid: string) => {
    if (!window.confirm('Delete this portal?')) return;

    const response = await fetch(`http://localhost:3001/api/delete_portal/${company_guid}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      // Remove bill from the list without reloading everything
      setPortals(portals.filter(portal => portal.company_guid !== company_guid));
    }
  }

  return (
    <div>
      <header>
        <h1>Utility Billing Automation</h1>
        <h2>Utility Bills</h2>
        <button onClick={() => setShowAddPortalModal(true)}>Add Portal</button>
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
                      ? <>
                        <button onClick={() => saveRow(portal)}>Save</button>
                        <button onClick={() => deletePortal(portal.company_guid)}>Delete</button>
                      </>
                      : <button onClick={() => setEditingId(portal.company_guid)}>Edit</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {showAddPortalModal && (
          <div className="modal-overlay">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Add New Portal</h3>
                <h5 style={{margin: 0}}>Type</h5>

                <select
                  value={newPortal.type}
                  onChange={(e => setNewPortal({ ...newPortal, type: e.target.value }))}
                >
                  <option value="">Select Bill Type</option>
                  <option value="Car Insurance">Car Insurance</option>
                  <option value="Electric">Electric</option>
                  <option value="Gas">Gas</option>
                  <option value="Internet">Internet</option>
                  <option value="Mortgage">Mortgage</option>
                  <option value="Sewer">Sewer</option>

                </select>

                <h5 style={{margin: 0}}>Company</h5>
                <input type="string" placeholder="Company Name" value={newPortal.name}
                  onChange={e => setNewPortal({ ...newPortal, name: e.target.value })} />

                <h5 style={{margin: 0}}>URL</h5>
                <input type="string" placeholder="URL" value={newPortal.url}
                  onChange={e => setNewPortal({ ...newPortal, url: e.target.value })} />
                
                <button onClick={handlePortal}>Save</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Portals;