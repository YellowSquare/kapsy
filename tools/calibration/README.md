# Calibration de la détection de doublons

`client/src/lib/signature.js` calcule une empreinte visuelle de chaque photo et
compare ces empreintes. Ces scripts mesurent sa fiabilité sur des photos
synthétiques : 10 objets (dont des pièges : même forme et autre couleur, ou
mêmes couleurs et autre forme), 6 prises de vue chacun (décalage, zoom,
rotation, lumière, fond, bruit, compression JPEG).

```bash
cd tools/calibration
python3 generate.py 7      # jeu de calibration (graine 7)
node evaluate.mjs          # % de doublons repérés / % de faux rapprochements par seuil
python3 generate.py 99     # second jeu, pour vérifier les seuils
node evaluate.mjs
```

Nécessite Python 3 et Pillow. Les images générées (`imgs/`, `meta.json`) ne sont pas versionnées.

**Limites connues :** l'objet est isolé du fond par sa couleur ; un objet blanc
sur fond crème ou gris sur fond gris est moins bien reconnu. Les photos
synthétiques ne remplacent pas des vraies : à recalibrer avec un jeu de vraies
photos dès qu'il existe.
