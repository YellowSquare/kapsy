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

test('photos : envoi, recherche de doublons, nettoyage', async () => {
  const { computeSignature, SIGNATURE_SIZE: S } = await import('../../client/src/lib/signature.js');
  const plain = (rgb) => {
    const px = new Uint8ClampedArray(S * S * 4);
    for (let p = 0; p < S * S; p++) {
      const x = p % S, y = (p / S) | 0;
      const inObj = Math.abs(x - S / 2) < S * 0.15 && Math.abs(y - S / 2) < S * 0.3;
      const c = inObj ? rgb : [240, 232, 220];
      px.set([...c, 255], p * 4);
    }
    return computeSignature(px);
  };

  // Format refusé : faux JPEG
  const bad = await fetch(`${base}/uploads`, { method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: Buffer.from('pas une image') });
  assert.equal(bad.status, 400);

  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1, 0xff, 0xd9]);
  const up = await fetch(`${base}/uploads`, { method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: jpeg });
  assert.equal(up.status, 201);
  const { url } = await up.json();
  assert.match(url, /^\/uploads\/[0-9a-f-]{36}\.jpg$/);
  const served = await fetch(base.replace('/api', '') + url);
  assert.equal(served.status, 200);
  assert.equal(served.headers.get('content-type'), 'image/jpeg');

  const c = await call('POST', '/collections', { name: 'Photos' });
  const redSig = plain([214, 40, 40]);
  const item = await call('POST', '/items', { name: 'Rouge', collectionId: c.body.id, imageUrl: url, imageSig: redSig });
  assert.equal(item.status, 201);

  const same = await call('POST', '/items/similar', { signature: plain([200, 36, 36]) });
  assert.equal(same.body.length, 1);
  assert.equal(same.body[0].item.id, item.body.id);
  assert.equal(same.body[0].level, 'strong');

  const other = await call('POST', '/items/similar', { signature: plain([40, 90, 200]) });
  assert.equal(other.body.length, 0);

  const excluded = await call('POST', '/items/similar', { signature: redSig, excludeId: item.body.id });
  assert.equal(excluded.body.length, 0);

  assert.equal((await call('POST', '/items/similar', { signature: { v: 2 } })).status, 400);

  // La photo est supprimée du disque avec la pièce.
  await call('DELETE', `/items/${item.body.id}`);
  assert.equal((await fetch(base.replace('/api', '') + url)).status, 404);
});
