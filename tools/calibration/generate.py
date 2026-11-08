import random, io, os, json
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

W,H = 900,1200
import sys
SEED = int(sys.argv[1]) if len(sys.argv) > 1 else 7
random.seed(SEED)
OUT = 'imgs'; os.makedirs(OUT, exist_ok=True)

# Objets : (nom, couleurs, forme)
OBJECTS = [
  ('pez_rouge_jaune', [(214,40,40),(250,200,40)], 'pez'),
  ('pez_rouge_bleu',  [(214,40,40),(40,90,200)], 'pez'),    # piège : même tige rouge
  ('pez_vert',        [(40,160,70),(240,230,220)], 'pez'),
  ('pez_rose',        [(236,72,153),(255,255,255)], 'pez'),
  ('pop_noir',        [(30,30,35),(235,200,170)], 'pop'),
  ('pop_bleu',        [(40,90,200),(235,200,170)], 'pop'),
  ('mug_orange',      [(240,130,30),(60,40,30)], 'mug'),
  ('mug_vert',        [(40,160,70),(60,40,30)], 'mug'),     # piège : même forme
  ('robot_gris',      [(150,155,160),(220,40,40)], 'robot'),
  ('pop_rouge',       [(214,40,40),(235,200,170)], 'pop'),  # piège : rouge comme les PEZ
]
BACKS = [(245,240,230),(225,215,200),(200,185,160),(235,238,242)]

def draw_object(d, kind, cols, cx, cy, s):
    a,b = cols
    if kind == 'pez':
        d.rounded_rectangle([cx-0.13*s, cy-0.05*s, cx+0.13*s, cy+0.55*s], 0.03*s, fill=a)
        d.ellipse([cx-0.2*s, cy-0.45*s, cx+0.2*s, cy-0.03*s], fill=b)
        d.ellipse([cx-0.09*s, cy-0.30*s, cx-0.03*s, cy-0.24*s], fill=(20,20,20)); d.ellipse([cx+0.03*s, cy-0.30*s, cx+0.09*s, cy-0.24*s], fill=(20,20,20))
    elif kind == 'pop':
        d.rounded_rectangle([cx-0.18*s, cy+0.05*s, cx+0.18*s, cy+0.5*s], 0.06*s, fill=a)
        d.rounded_rectangle([cx-0.3*s, cy-0.45*s, cx+0.3*s, cy+0.08*s], 0.15*s, fill=b)
        d.ellipse([cx-0.18*s, cy-0.22*s, cx-0.06*s, cy-0.1*s], fill=(10,10,10)); d.ellipse([cx+0.06*s, cy-0.22*s, cx+0.18*s, cy-0.1*s], fill=(10,10,10))
        d.rectangle([cx-0.3*s, cy-0.45*s, cx+0.3*s, cy-0.33*s], fill=a)
    elif kind == 'mug':
        d.rounded_rectangle([cx-0.3*s, cy-0.4*s, cx+0.3*s, cy+0.45*s], 0.12*s, fill=a)
        d.ellipse([cx-0.15*s, cy-0.15*s, cx-0.05*s, cy-0.05*s], fill=b); d.ellipse([cx+0.05*s, cy-0.15*s, cx+0.15*s, cy-0.05*s], fill=b)
        d.arc([cx-0.12*s, cy, cx+0.12*s, cy+0.15*s], 0, 180, fill=b, width=int(0.02*s))
    elif kind == 'robot':
        d.rectangle([cx-0.22*s, cy-0.05*s, cx+0.22*s, cy+0.5*s], fill=a)
        d.rectangle([cx-0.17*s, cy-0.4*s, cx+0.17*s, cy-0.08*s], fill=a)
        d.ellipse([cx-0.1*s, cy-0.3*s, cx-0.03*s, cy-0.23*s], fill=b); d.ellipse([cx+0.03*s, cy-0.3*s, cx+0.1*s, cy-0.23*s], fill=b)
        d.rectangle([cx-0.32*s, cy+0.0*s, cx-0.24*s, cy+0.3*s], fill=a); d.rectangle([cx+0.24*s, cy+0.0*s, cx+0.32*s, cy+0.3*s], fill=a)

def shoot(obj, variant):
    name, cols, kind = obj
    r = random.Random(f'{SEED}-{name}-{variant}')
    base = 0 if variant == 0 else r.randrange(len(BACKS))
    bg = BACKS[base]
    img = Image.new('RGB', (W,H), bg)
    d = ImageDraw.Draw(img)
    # léger dégradé de fond (lumière)
    for y in range(0, H, 8):
        k = 1 - 0.12*y/H
        d.rectangle([0,y,W,y+8], fill=tuple(int(c*k) for c in bg))
    if variant == 0: dx=dy=0; sc=1; rot=0; br=1; ct=1
    else:
        dx = r.uniform(-0.08,0.08)*W; dy = r.uniform(-0.06,0.06)*H
        sc = r.uniform(0.85,1.15); rot = r.uniform(-8,8); br = r.uniform(0.8,1.2); ct = r.uniform(0.85,1.15)
    s = 0.75*W*sc
    layer = Image.new('RGBA', (W,H), (0,0,0,0)); ld = ImageDraw.Draw(layer)
    draw_object(ld, kind, cols, W/2+dx, H/2+dy, s)
    layer = layer.rotate(rot, resample=Image.BICUBIC, center=(W/2+dx, H/2+dy))
    shadow = Image.new('RGBA', (W,H), (0,0,0,0)); shadow.paste((0,0,0,60), mask=layer.split()[3])
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    img = img.convert('RGBA'); img.alpha_composite(shadow, (12,16)); img.alpha_composite(layer)
    img = ImageEnhance.Brightness(img.convert('RGB')).enhance(br); img = ImageEnhance.Contrast(img).enhance(ct)
    if variant:
        # bruit capteur + flou léger
        noise = Image.effect_noise((W,H), r.uniform(8,20)).convert('RGB')
        img = Image.blend(img, noise, 0.06)
        if r.random() < 0.5: img = img.filter(ImageFilter.GaussianBlur(r.uniform(0.5,1.5)))
    buf = io.BytesIO(); img.save(buf, 'JPEG', quality=r.randint(60,90)); buf.seek(0)
    return Image.open(buf).convert('RGB')

def to64(img):
    # même prétraitement que le navigateur : carré central à 90 %, réduit à 64 × 64
    w,h = img.size; side = int(min(w,h)*0.9)
    box = ((w-side)//2, (h-side)//2, (w-side)//2+side, (h-side)//2+side)
    return img.crop(box).resize((128,128), Image.BILINEAR, reducing_gap=3.0).convert('RGBA')

meta = []
for oi,obj in enumerate(OBJECTS):
    for v in range(6):
        img = shoot(obj, v)
        fn = f'{obj[0]}_{v}'
        open(f'{OUT}/{fn}.rgba','wb').write(to64(img).tobytes())
        meta.append({'file': fn, 'obj': obj[0]})
json.dump(meta, open('meta.json','w'))
print(len(meta), 'images')
