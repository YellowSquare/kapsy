import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ValidationError } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp(store) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const notFound = (res, what) => res.status(404).json({ error: `${what} introuvable.` });

  app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Kapsy' }));
  app.get('/api/stats', async (req, res) => res.json(await store.stats()));

  // Collections
  app.get('/api/collections', async (req, res) => res.json(await store.listCollections()));
  app.get('/api/collections/:id', async (req, res) => {
    const c = await store.getCollection(req.params.id);
    c ? res.json(c) : notFound(res, 'Collection');
  });
  app.post('/api/collections', async (req, res) => {
    res.status(201).json(await store.createCollection(req.body ?? {}));
  });
  app.put('/api/collections/:id', async (req, res) => {
    const c = await store.updateCollection(req.params.id, req.body ?? {});
    c ? res.json(c) : notFound(res, 'Collection');
  });
  app.delete('/api/collections/:id', async (req, res) => {
    (await store.deleteCollection(req.params.id)) ? res.status(204).end() : notFound(res, 'Collection');
  });

  // Pièces
  app.get('/api/items', async (req, res) => {
    const { collectionId, status, q, sort, limit } = req.query;
    res.json(await store.listItems({ collectionId, status, q, sort, limit }));
  });
  app.get('/api/items/:id', async (req, res) => {
    const item = await store.getItem(req.params.id);
    item ? res.json(item) : notFound(res, 'Pièce');
  });
  app.post('/api/items', async (req, res) => {
    res.status(201).json(await store.createItem(req.body ?? {}));
  });
  app.put('/api/items/:id', async (req, res) => {
    const item = await store.updateItem(req.params.id, req.body ?? {});
    item ? res.json(item) : notFound(res, 'Pièce');
  });
  app.delete('/api/items/:id', async (req, res) => {
    (await store.deleteItem(req.params.id)) ? res.status(204).end() : notFound(res, 'Pièce');
  });

  app.use('/api', (req, res) => res.status(404).json({ error: 'Route inconnue.' }));

  // En production, le serveur sert aussi le frontend compilé.
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res, next) => {
    res.sendFile(path.join(clientDist, 'index.html'), (err) => err && next());
  });

  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) return res.status(400).json({ errors: err.errors });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ errors: ['JSON invalide.'] });
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  });

  return app;
}
