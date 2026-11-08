// Empreinte visuelle d'une photo, pour repérer les doublons probables.
// Fonctions pures (aucune dépendance au navigateur) : le client calcule
// l'empreinte, le serveur compare.
//
// Étapes :
//  1. estimer la couleur du fond à partir des bords de l'image ;
//  2. isoler l'objet (pixels qui s'écartent du fond, ombres comprises dans le fond) ;
//  3. recadrer sur l'objet → insensible à la position et à la distance ;
//  4. décrire l'objet par ses couleurs (teinte × saturation, gris),
//     sa silhouette (grille 8 × 8) et sa structure (dHash 64 bits).

export const SIGNATURE_VERSION = 2
export const SIGNATURE_SIZE = 128 // l'image est ramenée à 128 × 128 px avant le calcul

const HUE_BINS = 12
const SAT_BINS = 2
const GRAY_BINS = 3
export const HIST_LENGTH = HUE_BINS * SAT_BINS + GRAY_BINS

function rgbToHsv(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return [h, max ? d / max : 0, max / 255]
}

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

function backgroundModel(rgba, size) {
  const rs = [], gs = [], bs = []
  const m = Math.max(2, Math.round(size * 0.04))
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (x >= m && x < size - m && y >= m && y < size - m) continue
      const i = (y * size + x) * 4
      rs.push(rgba[i]); gs.push(rgba[i + 1]); bs.push(rgba[i + 2])
    }
  }
  const r = median(rs), g = median(gs), b = median(bs)
  const sum = r + g + b || 1
  return { cr: r / sum, cg: g / sum, lum: (r + g + b) / 3 }
}

function isBackground(r, g, b, bg) {
  const sum = r + g + b || 1
  const chroma = Math.hypot(r / sum - bg.cr, g / sum - bg.cg)
  const ratio = (r + g + b) / 3 / (bg.lum || 1)
  // Même teinte que le fond, plus sombre (ombre) ou un peu plus clair (reflet) : fond.
  return chroma < 0.02 && ratio > 0.45 && ratio < 1.12
}

/**
 * @param {Uint8ClampedArray|number[]} rgba pixels RGBA d'une image carrée size²
 * @returns {{ v: number, dhash: string, mask: string, hist: number[], aspect: number }}
 */
export function computeSignature(rgba, size = SIGNATURE_SIZE) {
  const n = size * size
  const bg = backgroundModel(rgba, size)
  const fg = new Uint8Array(n)
  const gray = new Float64Array(n)
  let count = 0
  for (let p = 0; p < n; p++) {
    const r = rgba[p * 4], g = rgba[p * 4 + 1], b = rgba[p * 4 + 2]
    gray[p] = 0.299 * r + 0.587 * g + 0.114 * b
    if (!isBackground(r, g, b, bg)) { fg[p] = 1; count++ }
  }
  // Objet introuvable (fond uni absent, objet qui remplit l'image) : on garde tout.
  if (count < n * 0.02 || count > n * 0.97) { fg.fill(1); count = n }

  // Boîte englobante robuste : on ignore 2 % des pixels de chaque côté (bruit).
  const xs = [], ys = []
  for (let p = 0; p < n; p++) if (fg[p]) { xs.push(p % size); ys.push((p / size) | 0) }
  xs.sort((a, b) => a - b); ys.sort((a, b) => a - b)
  const cut = Math.floor(xs.length * 0.02)
  let x0 = xs[cut], x1 = xs[xs.length - 1 - cut] + 1
  let y0 = ys[cut], y1 = ys[ys.length - 1 - cut] + 1
  const aspect = Math.round(((x1 - x0) / (y1 - y0)) * 1000) / 1000
  // Carré centré sur l'objet, pour ne pas déformer la silhouette.
  const side = Math.max(x1 - x0, y1 - y0)
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  x0 = cx - side / 2; y0 = cy - side / 2

  // Couleurs de l'objet uniquement. Répartition « douce » entre cases voisines :
  // une couleur proche d'une frontière (rouge vers 0°/360°, orange…) ne bascule
  // pas d'une case à l'autre au moindre changement de lumière.
  const ramp = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)))
  const hist = new Array(HIST_LENGTH).fill(0)
  let total = 0
  for (let p = 0; p < n; p++) {
    if (!fg[p]) continue
    const [h, s, v] = rgbToHsv(rgba[p * 4], rgba[p * 4 + 1], rgba[p * 4 + 2])
    const colorful = ramp(s, 0.14, 0.3) * ramp(v, 0.12, 0.24)
    if (colorful > 0) {
      const f = h / (360 / HUE_BINS) - 0.5
      const lo = Math.floor(f)
      const t = f - lo
      const hi = ((lo + 1) % HUE_BINS + HUE_BINS) % HUE_BINS
      const loBin = ((lo % HUE_BINS) + HUE_BINS) % HUE_BINS
      const strong = ramp(s, 0.4, 0.7)
      for (const [bin, w] of [[loBin, 1 - t], [hi, t]]) {
        hist[bin * SAT_BINS] += colorful * w * (1 - strong)
        hist[bin * SAT_BINS + 1] += colorful * w * strong
      }
    }
    if (colorful < 1) {
      const g = v * GRAY_BINS - 0.5
      const lo = Math.max(0, Math.min(GRAY_BINS - 1, Math.floor(g)))
      const hi = Math.min(GRAY_BINS - 1, lo + 1)
      const t = Math.max(0, Math.min(1, g - lo))
      hist[HUE_BINS * SAT_BINS + lo] += (1 - colorful) * (1 - t)
      hist[HUE_BINS * SAT_BINS + hi] += (1 - colorful) * t
    }
    total++
  }
  for (let k = 0; k < HIST_LENGTH; k++) hist[k] = Math.round((hist[k] / total) * 1e4) / 1e4

  // Échantillonnage d'une grille gw × gh dans le carré de l'objet.
  const grid = (gw, gh, source) => {
    const out = new Float64Array(gw * gh)
    for (let gy = 0; gy < gh; gy++) {
      for (let gx = 0; gx < gw; gx++) {
        const ax = Math.floor(x0 + (gx * side) / gw), bx = Math.max(ax + 1, Math.floor(x0 + ((gx + 1) * side) / gw))
        const ay = Math.floor(y0 + (gy * side) / gh), by = Math.max(ay + 1, Math.floor(y0 + ((gy + 1) * side) / gh))
        let sum = 0, k = 0
        for (let y = ay; y < by; y++) {
          for (let x = ax; x < bx; x++) {
            k++
            if (x < 0 || y < 0 || x >= size || y >= size) continue
            sum += source(y * size + x)
          }
        }
        out[gy * gw + gx] = sum / k
      }
    }
    return out
  }
  const toHex = (bits) => {
    let hex = ''
    for (let k = 0; k < 64; k += 4) hex += parseInt(bits.slice(k, k + 4), 2).toString(16)
    return hex
  }

  const m = grid(8, 8, (p) => fg[p])
  const mask = toHex(Array.from(m, (v) => (v >= 0.5 ? '1' : '0')).join(''))

  const cells = grid(9, 8, (p) => (fg[p] ? gray[p] : 0))
  let bits = ''
  for (let gy = 0; gy < 8; gy++) for (let gx = 0; gx < 8; gx++) bits += cells[gy * 9 + gx] < cells[gy * 9 + gx + 1] ? '1' : '0'

  return { v: SIGNATURE_VERSION, dhash: toHex(bits), mask, hist, aspect }
}

function bitsDiff(a, b) {
  let d = 0
  for (let k = 0; k < a.length; k++) {
    let x = parseInt(a[k], 16) ^ parseInt(b[k], 16)
    while (x) { d += x & 1; x >>= 1 }
  }
  return d
}

function maskIoU(a, b) {
  let inter = 0, union = 0
  for (let k = 0; k < a.length; k++) {
    const x = parseInt(a[k], 16), y = parseInt(b[k], 16)
    for (let bit = 0; bit < 4; bit++) {
      const p = (x >> bit) & 1, q = (y >> bit) & 1
      inter += p & q; union += p | q
    }
  }
  return union ? inter / union : 1
}

export function isValidSignature(sig) {
  const hex16 = (s) => typeof s === 'string' && /^[0-9a-f]{16}$/.test(s)
  return !!sig && sig.v === SIGNATURE_VERSION && hex16(sig.dhash) && hex16(sig.mask) &&
    typeof sig.aspect === 'number' && sig.aspect > 0 && sig.aspect < 100 &&
    Array.isArray(sig.hist) && sig.hist.length === HIST_LENGTH &&
    sig.hist.every((n) => typeof n === 'number' && n >= 0 && n <= 1)
}

/** Ressemblance entre deux empreintes, de 0 (rien à voir) à 1 (identiques). */
export function similarity(a, b) {
  if (a.v !== b.v) return 0
  let color = 0
  for (let k = 0; k < HIST_LENGTH; k++) color += Math.min(a.hist[k], b.hist[k])
  const silhouette = maskIoU(a.mask, b.mask)
  const structure = 1 - bitsDiff(a.dhash, b.dhash) / 64
  const ratio = Math.min(a.aspect, b.aspect) / Math.max(a.aspect, b.aspect)
  // La couleur est un facteur obligatoire : deux pièces de même forme mais de
  // couleurs différentes (cas typique des variantes PEZ ou Pop) ne doivent pas
  // se rapprocher. La forme vient ensuite affiner le score.
  const shape = 0.5 * silhouette + 0.2 * structure + 0.3 * ratio
  return color * (0.55 + 0.45 * shape)
}

// Seuils calibrés sur deux jeux de photos synthétiques (tools/calibration/) :
// ≥ 0,70 → 74–79 % des doublons repérés, aucun faux rapprochement observé ;
// ≥ 0,80 → 67–71 % des doublons, présentés comme « très ressemblants ».
export const MATCH_STRONG = 0.8
export const MATCH_POSSIBLE = 0.7
