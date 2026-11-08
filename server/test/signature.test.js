// Garde-fou sur l'empreinte visuelle : un même objet photographié autrement
// doit ressembler, deux objets différents (même forme OU mêmes couleurs) non.
// Calibration complète : tools/calibration/ (photos synthétiques, deux jeux).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSignature, similarity, isValidSignature, SIGNATURE_SIZE as S, MATCH_STRONG, MATCH_POSSIBLE,
} from '../../client/src/lib/signature.js';

// Dessine un « PEZ » (tête ronde + tige) sur un fond, dans une image S × S.
function shoot({ head, stem, bg = [240, 232, 220], dx = 0, dy = 0, scale = 1, light = 1, shape = 'pez' }) {
  const px = new Uint8ClampedArray(S * S * 4);
  const cx = S / 2 + dx * S, cy = S / 2 + dy * S, s = 0.8 * S * scale;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let c = bg.map((v) => v * (1 - 0.1 * (y / S))); // dégradé de lumière
      const inStem = shape === 'pez'
        ? Math.abs(x - cx) < 0.13 * s && y > cy - 0.05 * s && y < cy + 0.5 * s
        : Math.abs(x - cx) < 0.3 * s && y > cy - 0.4 * s && y < cy + 0.45 * s; // mug
      const inHead = shape === 'pez' && Math.hypot(x - cx, y - (cy - 0.24 * s)) < 0.2 * s;
      if (inStem) c = stem;
      if (inHead) c = head;
      const i = (y * S + x) * 4;
      px[i] = c[0] * light; px[i + 1] = c[1] * light; px[i + 2] = c[2] * light; px[i + 3] = 255;
    }
  }
  return computeSignature(px);
}

const red = [214, 40, 40], yellow = [250, 200, 40], blue = [40, 90, 200], green = [40, 160, 70];
const ref = shoot({ head: yellow, stem: red });

test('empreinte valide', () => {
  assert.ok(isValidSignature(ref));
  assert.equal(isValidSignature({ ...ref, dhash: 'zz' }), false);
});

test('même objet, autre prise de vue → très ressemblant', () => {
  const variants = [
    shoot({ head: yellow, stem: red, dx: 0.06, dy: -0.04 }),           // décalé
    shoot({ head: yellow, stem: red, scale: 0.85 }),                    // plus loin
    shoot({ head: yellow, stem: red, light: 0.82 }),                    // plus sombre
    shoot({ head: yellow, stem: red, bg: [205, 190, 165], scale: 1.1 }), // autre fond, plus près
  ];
  for (const v of variants) assert.ok(similarity(ref, v) >= MATCH_STRONG, `score ${similarity(ref, v)}`);
});

test('objets différents → pas de rapprochement', () => {
  const others = [
    shoot({ head: blue, stem: red }),                   // même tige rouge, autre tête
    shoot({ head: yellow, stem: green }),               // même tête, autre tige
    shoot({ head: yellow, stem: red, shape: 'mug' }),   // mêmes couleurs, autre forme
  ];
  for (const o of others) assert.ok(similarity(ref, o) < MATCH_POSSIBLE, `score ${similarity(ref, o)}`);
});
