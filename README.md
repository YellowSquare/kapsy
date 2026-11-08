# Kapsy

**L’app des collectionneurs.** Ta passion en un seul endroit.

Kapsy sert à gérer ses collections de pièces : PEZ, Pop, Mighty Muggs, et tout le reste.

## Fonctionnalités

- **Collections** créées librement, avec une couleur de repère et un total visé facultatif ; la progression ne s'affiche que si ce total est connu
- **Pièces** : nom, collection, série/licence, numéro ou référence, année, état, prix d'achat, quantité (doublons), image (URL), notes
- **Souhaits** : chaque pièce est possédée ou souhaitée ; « Je l'ai ! » la fait passer dans la collection
- **Photos** : prise de vue directe sur mobile ou choix d'une image ; la photo est réduite dans le navigateur avant l'envoi
- **Détection des doubles** : à chaque photo, Kapsy calcule une empreinte visuelle (couleurs de l'objet, silhouette, structure, après avoir écarté le fond) et la compare aux pièces existantes. Si une pièce ressemble, il propose « +1 exemplaire » (ou « Je l'ai trouvée ! » pour un souhait). C'est une suggestion à confirmer : voir [`tools/calibration/`](tools/calibration/) pour la fiabilité mesurée et les limites
- **Écrans** : accueil (résumé, collections, ajouts récents), fiche collection (compteurs, recherche, filtre, tri), souhaits
- Navigation en haut sur ordinateur, barre du bas sur mobile

## Identité visuelle

- Design system : [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) (tokens `--ks-*` repris dans `client/src/index.css`)
- Logos sources : `brand/` (PNG du moodboard ; les SVG définitifs restent à produire)
- Icônes : [Lucide](https://lucide.dev) via `lucide-react`

## Stack

- `client/` : React 19 + Vite
- `server/` : Node + Express 5, données dans `server/data/kapsy.json` et photos dans `server/data/uploads/` (ignorés par git)

## Démarrer

```bash
npm install
npm run dev
```

- Frontend : http://localhost:5173
- API : http://localhost:3001

## Production

```bash
npm run build
npm start
```

Le serveur Express sert alors l'API et le frontend compilé sur le même port.

## API

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/collections` | Collections avec compteurs (possédées, souhaits, doublons) |
| POST | `/api/collections` | Créer une collection (`name`, `color`, `target`, `description`) |
| GET / PUT / DELETE | `/api/collections/:id` | Lire, modifier, supprimer (supprime aussi ses pièces) |
| GET | `/api/items?collectionId=&status=&q=&sort=&limit=` | Liste des pièces (`sort` : `recent`, `name`, `number`) |
| POST | `/api/items` | Créer une pièce (`collectionId` obligatoire) |
| GET / PUT / DELETE | `/api/items/:id` | Lire, modifier (partiel), supprimer |
| POST | `/api/items/similar` | Pièces dont la photo ressemble à une empreinte (`signature`, `excludeId`) |
| POST | `/api/uploads` | Envoi d'une photo (corps brut JPEG/PNG/WebP, 8 Mo max) → `{ url }` |
| GET | `/api/stats` | Résumé global |

Statuts : `possede`, `recherche`. Couleurs : `teal`, `coral`, `mustard`.

Les anciennes données (catégories fixes) sont migrées automatiquement en collections au démarrage.

## Tests

```bash
npm test
```
