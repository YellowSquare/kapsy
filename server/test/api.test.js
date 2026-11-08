import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createApp } from '../src/app.js';
import { createStore } from '../src/store.js';

let dir, server, base;

async function call(method, url, body) {
  const res = await fetch(base + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
  });
  return { status: res.status, body: res.status === 204 ? null : await res.json() };
}

before(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'kapsy-'));
  server = createApp(createStore(path.join(dir, 'db.json'))).listen(0);
  base = `http://localhost:${server.address().port}/api`;
});
after(async () => {
  server.close();
  await rm(dir, { recursive: true, force: true });
});

test('collections et pièces : parcours complet', async () => {
  const c = await call('POST', '/collections', { name: 'PEZ Disney', target: 3, color: 'coral' });
  assert.equal(c.status, 201);
  assert.equal(c.body.owned, 0);

  const bad = await call('POST', '/items', { name: 'Sans collection' });
  assert.equal(bad.status, 400);
  assert.match(bad.body.errors.join(), /collection/);

  const a = await call('POST', '/items', { name: 'Mickey', collectionId: c.body.id, number: '10', quantity: 2 });
  await call('POST', '/items', { name: 'Donald', collectionId: c.body.id, number: '2' });
  await call('POST', '/items', { name: 'Dingo', collectionId: c.body.id, status: 'recherche' });
  assert.equal(a.status, 201);

  const summary = await call('GET', `/collections/${c.body.id}`);
  assert.deepEqual([summary.body.owned, summary.body.wishlist, summary.body.doubles], [2, 1, 1]);

  const byNumber = await call('GET', `/items?collectionId=${c.body.id}&sort=number`);
  assert.deepEqual(byNumber.body.map((i) => i.name), ['Donald', 'Mickey', 'Dingo']);

  const wishlist = await call('GET', '/items?status=recherche');
  assert.deepEqual(wishlist.body.map((i) => i.name), ['Dingo']);

  const stats = await call('GET', '/stats');
  assert.deepEqual([stats.body.collections, stats.body.owned, stats.body.wishlist], [1, 2, 1]);

  assert.equal((await call('DELETE', `/collections/${c.body.id}`)).status, 204);
  assert.equal((await call('GET', '/items')).body.length, 0);
});

test('validation des champs', async () => {
  const r = await call('POST', '/collections', { name: ' ', target: 0 });
  assert.equal(r.status, 400);
  assert.equal(r.body.errors.length, 2);
  const c = await call('POST', '/collections', { name: 'Test' });
  const img = await call('POST', '/items', { name: 'X', collectionId: c.body.id, imageUrl: 'javascript:alert(1)' });
  assert.equal(img.status, 400);
});

test('migration des catégories v1 vers des collections', async () => {
  const file = path.join(dir, 'legacy.json');
  await writeFile(file, JSON.stringify({
    items: [
      { id: '1', name: 'A', category: 'pez', status: 'possede', createdAt: '2026-01-01' },
      { id: '2', name: 'B', category: 'pez', status: 'possede', createdAt: '2026-01-02' },
      { id: '3', name: 'C', category: 'pop', status: 'recherche', createdAt: '2026-01-03' },
    ],
  }));
  const store = createStore(file);
  const cols = await store.listCollections();
  assert.deepEqual(cols.map((c) => [c.name, c.owned, c.wishlist]), [['PEZ', 2, 0], ['Pop', 0, 1]]);
  await store.flush();
  const saved = JSON.parse(await readFile(file, 'utf8'));
  assert.equal(saved.version, 2);
  assert.ok(saved.items.every((i) => i.collectionId && !i.category));
});
