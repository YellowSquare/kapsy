# Kapsy

**L’app des collectionneurs.** Ta passion en un seul endroit.

Kapsy sert à gérer ses collections de pièces : PEZ, Pop, Mighty Muggs, et tout le reste.

## Fonctionnalités

- Ajouter, modifier et supprimer des objets : nom, catégorie, série/licence, numéro, état, prix d'achat, quantité, image (URL) et notes
- Marquer un objet comme possédé ou souhaité, pour tenir une liste de souhaits
- Filtrer par catégorie et par statut, et rechercher par nom, série, numéro ou notes
- Voir des statistiques : nombre d'objets, valeur d'achat totale, répartition par catégorie

## Identité visuelle

- Design system : [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) (tokens `--ks-*` repris dans `client/src/index.css`)
- Logos sources : `brand/` (PNG du moodboard ; les SVG définitifs restent à produire)
- Icônes : [Lucide](https://lucide.dev) via `lucide-react`

## Stack

- `client/` : React 19 + Vite
- `server/` : Node + Express 5, données stockées dans `server/data/kapsy.json` (fichier ignoré par git)

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
| GET | `/api/items?category=&status=&q=` | Liste des objets (filtres optionnels) |
| POST | `/api/items` | Créer un objet |
| PUT | `/api/items/:id` | Modifier un objet (partiel) |
| DELETE | `/api/items/:id` | Supprimer un objet |
| GET | `/api/stats` | Statistiques de la collection |

Catégories : `pez`, `pop`, `mighty-mug`, `autre`. Statuts : `possede`, `recherche`.
