import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = process.env.KAPSY_DATA_FILE || path.join(__dirname, '..', 'data', 'kapsy.json');

export const CATEGORIES = ['pez', 'pop', 'mighty-mug', 'autre'];
export const STATUSES = ['possede', 'recherche'];
export const CONDITIONS = ['neuf-boite', 'neuf', 'tres-bon', 'bon', 'abime'];

let cache = null;
let writing = Promise.resolve();

async function load() {
  if (cache) return cache;
  try {
    cache = JSON.parse(await readFile(DATA_FILE, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    cache = { items: [] };
  }
  return cache;
}

function persist() {
  // Écritures sérialisées + fichier temporaire pour éviter un JSON corrompu.
  writing = writing.then(async () => {
    await mkdir(path.dirname(DATA_FILE), { recursive: true });
    const tmp = `${DATA_FILE}.tmp`;
    await writeFile(tmp, JSON.stringify(cache, null, 2));
    await rename(tmp, DATA_FILE);
  });
  return writing;
}

export function validate(input, { partial = false } = {}) {
  const errors = [];
  const out = {};
  const str = (v) => (typeof v === 'string' ? v.trim() : '');

  if (!partial || 'name' in input) {
    out.name = str(input.name);
    if (!out.name) errors.push('Le nom est obligatoire.');
  }
  if (!partial || 'category' in input) {
    out.category = input.category;
    if (!CATEGORIES.includes(out.category)) errors.push('Catégorie invalide.');
  }
  if (!partial || 'status' in input) {
    out.status = input.status ?? 'possede';
    if (!STATUSES.includes(out.status)) errors.push('Statut invalide.');
  }
  if ('condition' in input && input.condition) {
    out.condition = input.condition;
    if (!CONDITIONS.includes(out.condition)) errors.push('État invalide.');
  } else if (!partial) {
    out.condition = null;
  }
  for (const key of ['series', 'number', 'notes', 'imageUrl']) {
    if (!partial || key in input) out[key] = str(input[key]);
  }
  if (!partial || 'price' in input) {
    const p = input.price;
    if (p === '' || p === null || p === undefined) out.price = null;
    else if (Number.isFinite(Number(p)) && Number(p) >= 0) out.price = Number(p);
    else errors.push('Prix invalide.');
  }
  if (!partial || 'quantity' in input) {
    const q = input.quantity ?? 1;
    if (Number.isInteger(Number(q)) && Number(q) >= 1) out.quantity = Number(q);
    else errors.push('La quantité doit être un entier ≥ 1.');
  }
  return { errors, data: out };
}

export async function listItems({ category, status, q } = {}) {
  const { items } = await load();
  const needle = q?.trim().toLowerCase();
  return items
    .filter((i) => !category || i.category === category)
    .filter((i) => !status || i.status === status)
    .filter((i) => !needle || [i.name, i.series, i.number, i.notes].some((f) => f?.toLowerCase().includes(needle)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getItem(id) {
  const { items } = await load();
  return items.find((i) => i.id === id) ?? null;
}

export async function createItem(data) {
  const db = await load();
  const now = new Date().toISOString();
  const item = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
  db.items.push(item);
  await persist();
  return item;
}

export async function updateItem(id, data) {
  const db = await load();
  const item = db.items.find((i) => i.id === id);
  if (!item) return null;
  Object.assign(item, data, { updatedAt: new Date().toISOString() });
  await persist();
  return item;
}

export async function deleteItem(id) {
  const db = await load();
  const idx = db.items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  db.items.splice(idx, 1);
  await persist();
  return true;
}

export async function stats() {
  const { items } = await load();
  const byCategory = Object.fromEntries(CATEGORIES.map((c) => [c, { possede: 0, recherche: 0 }]));
  let total = 0;
  let value = 0;
  for (const i of items) {
    const qty = i.quantity ?? 1;
    byCategory[i.category][i.status] += qty;
    if (i.status === 'possede') {
      total += qty;
      value += (i.price ?? 0) * qty;
    }
  }
  return { total, wishlist: items.filter((i) => i.status === 'recherche').length, value, byCategory };
}
