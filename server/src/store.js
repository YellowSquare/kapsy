import { readFile, writeFile, rename, mkdir, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { isValidSignature, similarity, MATCH_POSSIBLE, MATCH_STRONG } from '../../client/src/lib/signature.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_FILE = path.join(__dirname, '..', 'data', 'kapsy.json');

export const STATUSES = ['possede', 'recherche'];
export const CONDITIONS = ['neuf-boite', 'neuf', 'tres-bon', 'bon', 'abime'];
export const COLORS = ['teal', 'coral', 'mustard'];
export const SORTS = ['recent', 'name', 'number'];

// Anciennes catégories fixes (v1) → collections (v2)
const LEGACY_CATEGORIES = {
  pez: { name: 'PEZ', color: 'coral' },
  pop: { name: 'Pop', color: 'teal' },
  'mighty-mug': { name: 'Mighty Muggs', color: 'mustard' },
  autre: { name: 'Autres', color: 'teal' },
};

export class ValidationError extends Error {
  constructor(errors) {
    super(errors.join(' '));
    this.errors = errors;
  }
}

const now = () => new Date().toISOString();
const str = (v) => (typeof v === 'string' ? v.trim() : '');

export function migrate(db) {
  db.collections ??= [];
  db.items ??= [];
  if ((db.version ?? 1) < 2) {
    const byCategory = {};
    for (const item of db.items) {
      if (item.collectionId || !item.category) continue;
      const legacy = LEGACY_CATEGORIES[item.category] ?? LEGACY_CATEGORIES.autre;
      if (!byCategory[item.category]) {
        const c = { id: randomUUID(), name: legacy.name, color: legacy.color, target: null, createdAt: now(), updatedAt: now() };
        db.collections.push(c);
        byCategory[item.category] = c.id;
      }
      item.collectionId = byCategory[item.category];
      delete item.category;
    }
    db.version = 2;
  }
  return db;
}

const IMAGE_TYPES = {
  'image/jpeg': { ext: 'jpg', magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/png': { ext: 'png', magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  'image/webp': { ext: 'webp', magic: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
};
export const UPLOAD_TYPES = Object.keys(IMAGE_TYPES);
const UPLOAD_URL = /^\/uploads\/[0-9a-f-]{36}\.(jpg|png|webp)$/;

export function createStore(file = process.env.KAPSY_DATA_FILE || DEFAULT_FILE) {
  const uploadsDir = path.join(path.dirname(file), 'uploads');
  let cache = null;
  let writing = Promise.resolve();

  async function load() {
    if (cache) return cache;
    let db;
    try {
      db = JSON.parse(await readFile(file, 'utf8'));
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      db = { version: 2 };
    }
    const before = db.version;
    cache = migrate(db);
    if (before !== cache.version) await persist();
    return cache;
  }

  function persist() {
    // Écritures sérialisées + fichier temporaire pour éviter un JSON corrompu.
    writing = writing.then(async () => {
      await mkdir(path.dirname(file), { recursive: true });
      const tmp = `${file}.tmp`;
      await writeFile(tmp, JSON.stringify(cache, null, 2));
      await rename(tmp, file);
    });
    return writing;
  }

  function validateCollection(input, { partial = false } = {}) {
    const errors = [];
    const out = {};
    if (!partial || 'name' in input) {
      out.name = str(input.name);
      if (!out.name) errors.push('Le nom de la collection est obligatoire.');
      else if (out.name.length > 80) errors.push('Le nom est trop long (80 caractères max).');
    }
    if (!partial || 'color' in input) {
      out.color = input.color || COLORS[0];
      if (!COLORS.includes(out.color)) errors.push('Couleur invalide.');
    }
    if (!partial || 'target' in input) {
      const t = input.target;
      if (t === '' || t === null || t === undefined) out.target = null;
      else if (Number.isInteger(Number(t)) && Number(t) >= 1) out.target = Number(t);
      else errors.push('Le total visé doit être un entier ≥ 1.');
    }
    if (!partial || 'description' in input) out.description = str(input.description);
    if (errors.length) throw new ValidationError(errors);
    return out;
  }

  async function validateItem(input, { partial = false } = {}) {
    const db = await load();
    const errors = [];
    const out = {};
    if (!partial || 'name' in input) {
      out.name = str(input.name);
      if (!out.name) errors.push('Le nom est obligatoire.');
    }
    if (!partial || 'collectionId' in input) {
      out.collectionId = input.collectionId;
      if (!db.collections.some((c) => c.id === out.collectionId)) errors.push('Choisis une collection.');
    }
    if (!partial || 'status' in input) {
      out.status = input.status ?? 'possede';
      if (!STATUSES.includes(out.status)) errors.push('Statut invalide.');
    }
    if ('condition' in input && input.condition) {
      out.condition = input.condition;
      if (!CONDITIONS.includes(out.condition)) errors.push('État invalide.');
    } else if (!partial || 'condition' in input) {
      out.condition = null;
    }
    for (const key of ['series', 'number', 'year', 'notes', 'imageUrl']) {
      if (!partial || key in input) out[key] = str(input[key] == null ? '' : String(input[key]));
    }
    if (out.imageUrl && !/^https?:\/\//i.test(out.imageUrl) && !UPLOAD_URL.test(out.imageUrl)) {
      errors.push('L’image doit être une adresse http(s) ou une photo envoyée.');
    }
    if (!partial || 'imageSig' in input) {
      out.imageSig = input.imageSig ?? null;
      if (out.imageSig !== null && !isValidSignature(out.imageSig)) errors.push('Empreinte de photo invalide.');
    }
    // Une nouvelle image sans empreinte invalide l'ancienne empreinte.
    if (partial && 'imageUrl' in input && !('imageSig' in input)) out.imageSig = null;
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
    if (errors.length) throw new ValidationError(errors);
    return out;
  }

  function summarize(collection, items) {
    const own = items.filter((i) => i.collectionId === collection.id);
    const owned = own.filter((i) => i.status === 'possede');
    return {
      ...collection,
      owned: owned.length,
      wishlist: own.length - owned.length,
      doubles: owned.filter((i) => i.quantity > 1).length,
      covers: own
        .filter((i) => i.imageUrl)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 4)
        .map((i) => i.imageUrl),
    };
  }

  // Supprime les photos envoyées qui ne servent plus à aucune pièce.
  async function removeUnusedUploads(urls) {
    const { items } = await load();
    for (const url of new Set(urls)) {
      if (!url || !UPLOAD_URL.test(url) || items.some((i) => i.imageUrl === url)) continue;
      await unlink(path.join(uploadsDir, path.basename(url))).catch(() => {});
    }
  }

  const compare = {
    recent: (a, b) => b.createdAt.localeCompare(a.createdAt),
    name: (a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }),
    number: (a, b) => (a.number || '￿').localeCompare(b.number || '￿', 'fr', { numeric: true }),
  };

  return {
    async listCollections() {
      const { collections, items } = await load();
      return collections
        .map((c) => summarize(c, items))
        .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
    },

    async getCollection(id) {
      const { collections, items } = await load();
      const c = collections.find((x) => x.id === id);
      return c ? summarize(c, items) : null;
    },

    async createCollection(input) {
      const data = validateCollection(input);
      const db = await load();
      const c = { id: randomUUID(), ...data, createdAt: now(), updatedAt: now() };
      db.collections.push(c);
      await persist();
      return summarize(c, db.items);
    },

    async updateCollection(id, input) {
      const data = validateCollection(input, { partial: true });
      const db = await load();
      const c = db.collections.find((x) => x.id === id);
      if (!c) return null;
      Object.assign(c, data, { updatedAt: now() });
      await persist();
      return summarize(c, db.items);
    },

    // Supprime la collection et toutes ses pièces.
    async deleteCollection(id) {
      const db = await load();
      const idx = db.collections.findIndex((x) => x.id === id);
      if (idx === -1) return false;
      db.collections.splice(idx, 1);
      const removed = db.items.filter((i) => i.collectionId === id);
      db.items = db.items.filter((i) => i.collectionId !== id);
      await persist();
      await removeUnusedUploads(removed.map((i) => i.imageUrl));
      return true;
    },

    async listItems({ collectionId, status, q, sort = 'recent', limit } = {}) {
      const { items } = await load();
      const needle = q?.trim().toLowerCase();
      const list = items
        .filter((i) => !collectionId || i.collectionId === collectionId)
        .filter((i) => !status || i.status === status)
        .filter((i) => !needle || [i.name, i.series, i.number, i.year, i.notes].some((f) => f?.toLowerCase().includes(needle)))
        .sort(compare[sort] ?? compare.recent);
      const n = Number(limit);
      return Number.isInteger(n) && n > 0 ? list.slice(0, n) : list;
    },

    async getItem(id) {
      const { items } = await load();
      return items.find((i) => i.id === id) ?? null;
    },

    async createItem(input) {
      const data = await validateItem(input);
      const db = await load();
      const item = { id: randomUUID(), ...data, createdAt: now(), updatedAt: now() };
      db.items.push(item);
      await persist();
      return item;
    },

    async updateItem(id, input) {
      const data = await validateItem(input, { partial: true });
      const db = await load();
      const item = db.items.find((i) => i.id === id);
      if (!item) return null;
      const previousImage = item.imageUrl;
      Object.assign(item, data, { updatedAt: now() });
      await persist();
      if (previousImage !== item.imageUrl) await removeUnusedUploads([previousImage]);
      return item;
    },

    async deleteItem(id) {
      const db = await load();
      const idx = db.items.findIndex((i) => i.id === id);
      if (idx === -1) return false;
      const [removed] = db.items.splice(idx, 1);
      await persist();
      await removeUnusedUploads([removed.imageUrl]);
      return true;
    },

    // Pièces dont la photo ressemble à l'empreinte donnée (doublons probables).
    async findSimilar(signature, { excludeId, limit = 3 } = {}) {
      if (!isValidSignature(signature)) throw new ValidationError(['Empreinte de photo invalide.']);
      const { items } = await load();
      return items
        .filter((i) => i.id !== excludeId && i.imageSig && isValidSignature(i.imageSig))
        .map((i) => ({ item: i, score: Math.round(similarity(signature, i.imageSig) * 1000) / 1000 }))
        .filter((m) => m.score >= MATCH_POSSIBLE)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((m) => ({ ...m, level: m.score >= MATCH_STRONG ? 'strong' : 'possible' }));
    },

    async saveUpload(buffer, type) {
      const spec = IMAGE_TYPES[type];
      if (!spec || !buffer?.length || !spec.magic(buffer)) {
        throw new ValidationError(['Format d’image non pris en charge (JPEG, PNG ou WebP).']);
      }
      await mkdir(uploadsDir, { recursive: true });
      const name = `${randomUUID()}.${spec.ext}`;
      await writeFile(path.join(uploadsDir, name), buffer);
      return { url: `/uploads/${name}` };
    },

    uploadsDir,

    async stats() {
      const { collections, items } = await load();
      const owned = items.filter((i) => i.status === 'possede');
      return {
        collections: collections.length,
        owned: owned.length,
        wishlist: items.length - owned.length,
        doubles: owned.filter((i) => i.quantity > 1).length,
        value: owned.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0),
      };
    },

    flush: () => writing,
  };
}
