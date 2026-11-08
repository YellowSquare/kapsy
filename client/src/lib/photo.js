import { computeSignature, SIGNATURE_SIZE } from './signature'

const MAX_SIDE = 1600
const QUALITY = 0.85

async function decode(file) {
  // createImageBitmap applique l'orientation EXIF des photos de téléphone.
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch { /* format non pris en charge : repli sur <img> */ }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h })

/**
 * Prépare une photo : JPEG réduit pour l'envoi + empreinte visuelle.
 * @returns {Promise<{ blob: Blob, previewUrl: string, signature: object }>}
 */
export async function preparePhoto(file) {
  if (!file.type.startsWith('image/')) throw new Error('Ce fichier n’est pas une image.')
  const img = await decode(file)
  const w = img.width, h = img.height
  if (!w || !h) throw new Error('Impossible de lire cette image.')

  const k = Math.min(1, MAX_SIDE / Math.max(w, h))
  const out = canvas(Math.round(w * k), Math.round(h * k))
  const ctx = out.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, out.width, out.height)
  const blob = await new Promise((resolve, reject) =>
    out.toBlob((b) => (b ? resolve(b) : reject(new Error('Impossible de préparer la photo.'))), 'image/jpeg', QUALITY))

  // Empreinte : carré central (90 %) réduit à SIGNATURE_SIZE.
  const side = Math.min(w, h) * 0.9
  const small = canvas(SIGNATURE_SIZE, SIGNATURE_SIZE)
  const sctx = small.getContext('2d', { willReadFrequently: true })
  sctx.imageSmoothingQuality = 'high'
  sctx.drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, SIGNATURE_SIZE, SIGNATURE_SIZE)
  const signature = computeSignature(sctx.getImageData(0, 0, SIGNATURE_SIZE, SIGNATURE_SIZE).data)

  img.close?.()
  return { blob, previewUrl: URL.createObjectURL(blob), signature }
}
