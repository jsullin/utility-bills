import express from 'express';
import cors from 'cors';

import bill_routes from './routes/bills'
import portal_routes from './routes/portals'

const app = express();

// CORS: only your frontend can call this API
app.use(cors({ origin: 'http://localhost:5173' })); // update to match your Vite dev server

app.use(express.json());

app.use('/api/', bill_routes, portal_routes)


app.listen(3001, () => console.log('Server running on port 3001'));