import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as store from './store.js';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Kapsy' });
});

app.get('/api/meta', (req, res) => {
  res.json({ categories: store.CATEGORIES, statuses: store.STATUSES, conditions: store.CONDITIONS });
});

app.get('/api/stats', async (req, res) => {
  res.json(await store.stats());
});

app.get('/api/items', async (req, res) => {
  const { category, status, q } = req.query;
  res.json(await store.listItems({ category, status, q }));
});

app.get('/api/items/:id', async (req, res) => {
  const item = await store.getItem(req.params.id);
  if (!item) return res.status(404).json({ error: 'Objet introuvable.' });
  res.json(item);
});

app.post('/api/items', async (req, res) => {
  const { errors, data } = store.validate(req.body ?? {});
  if (errors.length) return res.status(400).json({ errors });
  res.status(201).json(await store.createItem(data));
});

app.put('/api/items/:id', async (req, res) => {
  const { errors, data } = store.validate(req.body ?? {}, { partial: true });
  if (errors.length) return res.status(400).json({ errors });
  const item = await store.updateItem(req.params.id, data);
  if (!item) return res.status(404).json({ error: 'Objet introuvable.' });
  res.json(item);
});

app.delete('/api/items/:id', async (req, res) => {
  const ok = await store.deleteItem(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Objet introuvable.' });
  res.status(204).end();
});

// En production, le serveur sert aussi le frontend compilé.
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (req, res, next) => {
  res.sendFile(path.join(clientDist, 'index.html'), (err) => err && next());
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur.' });
});

app.listen(PORT, () => {
  console.log(`Kapsy API sur http://localhost:${PORT}`);
});
