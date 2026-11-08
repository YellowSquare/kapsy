# Kapsy — Design System

> **Version :** 1.0 — 8 novembre 2026  
> **Produit :** application de gestion de collections personnelles  
> **Direction artistique :** sympathique · chaleureuse · moderne · pop maîtrisée  
> **Statut :** document de référence initial, à valider sur maquettes et prototypes

---

## 1. ADN DE MARQUE

### 1.1. Promesse

**Kapsy — L’app des collectionneurs.**  
**Signature éditoriale :** « Ta passion en un seul endroit. »

Kapsy permet de **cataloguer, organiser, suivre et compléter** des collections d'objets très variés : figurines, distributeurs PEZ, Mighty Muggs, cartes, jeux, sneakers, objets vintage, etc.

Kapsy célèbre l'attachement aux objets, sans réserver le produit à une licence, une franchise ou une catégorie de collection.

### 1.2. Personnalité

| Attribut | Traduction visuelle et éditoriale |
|---|---|
| **Sympathique** | Formes arrondies, interface accueillante, microcopie directe |
| **Chaleureuse** | Fond crème, accents corail et moutarde, photographies d'objets |
| **Moderne** | Hiérarchie lisible, espaces généreux, composants sobres |
| **Passionnée** | Mise en valeur des objets, collections et envies |
| **Fiable** | Informations structurées, statistiques compréhensibles, états explicites |

**Équilibre recherché :** 70 % fonctionnel / 30 % expressif. Le plaisir vient du contenu et des collections, pas d'effets permanents.

### 1.3. Différenciation avec Kagiu

- **Kapsy :** bleu profond, turquoise, corail, moutarde, crème ; iconographie de cartes superposées, objets et étagères ; vocabulaire de collection.
- **Kagiu :** identité violette et ludique liée aux quiz et à l'apprentissage.
- Pour Kapsy, **ne pas réintroduire le violet comme couleur structurante**, ni les éclairs, les « missions », les codes d'apprentissage gamifié ou une densité excessive de petits ornements.
- La proximité de chaleur et de convivialité entre les deux marques est acceptable ; leurs **formes, palettes, écrans et références graphiques doivent rester distincts**.

---

## 2. LOGOTYPE & IDENTITÉ

### 2.1. Concept du logo

La nouvelle direction retenue repose sur :

- Un **« K » blanc dans un carré bleu profond aux coins arrondis**.
- Des **cartes colorées superposées**, décalées derrière le carré : turquoise, corail et moutarde. Elles symbolisent la diversité, l'accumulation et l'organisation des pièces.
- Un **wordmark « Kapsy »** en caractères ronds et solides, en bleu profond.
- De petits **rayons moutarde** en accent expressif, à usage ponctuel.

Cette description correspond au **moodboard retenu**. Les fichiers de logo définitifs (vectorisation, contours, épaisseurs et marges optiques) devront être figés séparément avant livraison de production.

### 2.2. Versions à produire

1. **Principale horizontale :** pictogramme + « Kapsy » bleu profond sur fond clair.
2. **Inversée :** pictogramme + « Kapsy » blanc sur fond bleu profond.
3. **Icône autonome :** pictogramme K et cartes superposées, sans texte.
4. **Monochrome :** bleu profond ou blanc, pour les contraintes techniques.
5. **Favicon :** déclinaison simplifiée, testée à 16 et 32 px.

### 2.3. Règles d'usage recommandées

- **Zone de protection :** au minimum la largeur de la hampe du « K » sur chaque côté du bloc logo.
- **Taille minimale indicative :** logo horizontal 120 px de large à l'écran ; icône 24 px si le motif reste lisible.
- **Fond privilégié :** crème `#FFF3E6`, blanc ou bleu profond selon la version.
- Préserver le ratio et les décalages des cartes.
- Ne pas changer arbitrairement l'ordre des couleurs, étirer le logo, ajouter une ombre forte ni placer le logo sur une photo chargée.
- Pour un petit usage, supprimer les rayons décoratifs plutôt que réduire leur lisibilité.

### 2.4. Livrables attendus

`logo-horizontal.svg`, `logo-inverse.svg`, `logo-monochrome.svg`, `app-icon.svg`, `favicon.svg`, ainsi que PNG transparents et déclinaisons d'icônes natives.

> **Important :** le moodboard est une **référence visuelle**, pas un fichier source vectoriel prêt à intégrer tel quel.

---

## 3. PALETTE DE COULEURS

### 3.1. Palette principale

| Token | Hex | Rôle | Usage |
|---|---|---|---|
| `brand.deep` | `#0F3B46` | Bleu profond | Logo, navigation, titres, boutons primaires |
| `brand.teal` | `#2DB6A8` | Turquoise | Succès, éléments interactifs secondaires, progression |
| `brand.coral` | `#FF6B5B` | Corail | Mise en avant, wishlist, pastilles et accents |
| `brand.mustard` | `#FFC83D` | Moutarde | Énergie, statistiques, badges, accents |
| `surface.cream` | `#FFF3E6` | Crème | Fond principal chaleureux |
| `surface.mist` | `#E7EEF2` | Gris bleuté clair | Bordures, fonds neutres, états discrets |

### 3.2. Couleurs fonctionnelles complémentaires

Ces couleurs sont **dérivées pour l'usage numérique** ; elles ne modifient pas la palette de marque.

| Token | Hex | Usage |
|---|---|---|
| `text.primary` | `#12232B` | Texte courant, très contrasté |
| `text.secondary` | `#51636A` | Descriptions, métadonnées |
| `text.inverse` | `#FFFFFF` | Texte sur fond bleu profond |
| `brand.teal-dark` | `#116B65` | Liens / texte turquoise accessibles |
| `brand.coral-dark` | `#A83C31` | Texte corail accessible |
| `surface.white` | `#FFFFFF` | Cartes et panneaux |
| `surface.tinted` | `#F9F7F3` | Sections neutres |
| `border.default` | `#D8E2E5` | Séparateurs, champs |
| `state.danger` | `#A83C31` | Erreurs, destruction |
| `state.success` | `#116B65` | Confirmation, statut positif |
| `state.warning` | `#705000` | Avertissement sur jaune clair |

### 3.3. Répartition conseillée

- **55 %** : crème, blanc et surfaces très claires.
- **25 %** : bleu profond (en-têtes, titres, navigation et actions).
- **20 %** : turquoise, corail et moutarde réunis (accents et repères).

Éviter d'utiliser trois couleurs d'accent en concurrence dans un même composant.

### 3.4. Combinaisons et contrastes

Contrastes calculés sur les couleurs hexadécimales ci-dessus (ratio WCAG approximatif) :

| Premier plan / fond | Ratio | Usage recommandé |
|---|---:|---|
| Blanc / bleu profond | **12,1:1** | Texte normal et grands titres ✓ |
| Bleu profond / crème | **11,1:1** | Texte normal ✓ |
| Bleu profond / turquoise | **4,8:1** | Texte normal ✓ |
| Texte foncé `#12232B` / corail | **5,8:1** | Texte normal ✓ |
| Bleu profond / moutarde | **7,8:1** | Texte normal ✓ |
| Blanc / turquoise | **2,5:1** | **À éviter** pour le texte normal ✕ |
| Blanc / corail | **2,8:1** | **À éviter** pour le texte normal ✕ |
| Blanc / moutarde | **1,5:1** | **À éviter** pour le texte normal ✕ |

**Règle impérative :** sur les fonds turquoise, corail et moutarde, préférer un texte bleu profond ou très foncé, et vérifier les contrastes des composants réels. Les versions foncées des accents servent aux liens et textes sur fond clair.

---

## 4. TYPOGRAPHIE

### 4.1. Polices

- **Baloo 2** — titres, marque, accents courts, chiffres clés. Trait rond et expressif.
- **Inter** — textes, formulaires, navigation, tableaux, fiches et légendes. Lisibilité et neutralité.
- **Fallback :** `ui-rounded, system-ui, sans-serif` pour Baloo 2 et `system-ui, sans-serif` pour Inter.

### 4.2. Échelle typographique — desktop

| Style | Police | Graisse | Taille / interligne |
|---|---|---:|---|
| `display` | Baloo 2 | 700 | 48 / 52 px |
| `h1` | Baloo 2 | 700 | 40 / 44 px |
| `h2` | Baloo 2 | 700 | 32 / 38 px |
| `h3` | Baloo 2 | 700 | 26 / 32 px |
| `h4` | Baloo 2 | 600 | 22 / 28 px |
| `body-lg` | Inter | 400 | 18 / 28 px |
| `body` | Inter | 400 | 16 / 24 px |
| `body-sm` | Inter | 400 | 14 / 21 px |
| `label` | Inter | 600 | 14 / 20 px |
| `caption` | Inter | 500 | 12 / 18 px |
| `button` | Inter | 600 | 15 / 20 px |

### 4.3. Mobile

- `display` : 36 / 40 px ; `h1` : 32 / 38 px ; `h2` : 28 / 34 px ; `h3` : 24 / 30 px.
- Corps de texte principal : **16 px minimum** ; tailles 12–14 px réservées aux informations secondaires.
- Conserver la casse naturelle : éviter les titres entiers en capitales.
- Limiter Baloo 2 aux titres et éléments expressifs. **Inter reste la police par défaut de l'interface.**

---

## 5. FORMES, ESPACEMENTS & ÉLÉVATION

### 5.1. Grille d'espacement

Base de **4 px** : `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `64`.

- Espacement entre éléments d'une carte : 8–12 px.
- Padding standard d'une carte : 16–24 px.
- Espacement entre sections : 32–48 px.
- Padding de page mobile : 16 px ; desktop : 24–48 px selon la largeur.

### 5.2. Rayons de bordure

| Token | Valeur | Usage |
|---|---:|---|
| `radius.sm` | 8 px | Chips, petits contrôles |
| `radius.md` | 12 px | Champs, boutons |
| `radius.lg` | 18 px | Cartes standard |
| `radius.xl` | 24 px | Blocs éditoriaux, panneaux |
| `radius.full` | 9999 px | Badges, pastilles |

### 5.3. Bordures et ombres

- Bordure standard : `1px solid #D8E2E5`.
- Ombre légère pour les cartes, pas de flou massif.
- Accentuer le survol via bordure, translation légère ou ombre discrète.
- Éviter les effets glassmorphism, néons, gros dégradés violets et multiples couches de relief.

### 5.4. Motifs identitaires

- **Cartes superposées** : motif principal (référence au pictogramme).
- **Étagères et grilles** : trames associées à l'ordre et au classement.
- **Coins arrondis** : vocabulaire constant.
- **Petits rayons moutarde** : ponctuation occasionnelle dans les moments positifs.
- Utiliser le motif en **petite dose** : les objets collectionnés sont les véritables protagonistes.

---

## 6. PHOTOGRAPHIE ET ILLUSTRATION

### 6.1. Direction photo

- Objets de collection cadrés avec soin, colorés, nets et tangibles.
- Éclairage naturel ou studio doux, ambiance chaleureuse.
- Fonds neutres ou étagères réelles ; matières visibles.
- Diversité des passions et des catégories de collection.
- Donner envie de découvrir l'objet et ses détails, pas seulement son emballage.

**À éviter :** photomontages surchargés, lumières néon systématiques, photos sombres sans lisibilité, illustrations enfantines partout.

### 6.2. Droits des visuels

Les personnages et licences visibles dans les planches d'inspiration illustrent l'univers collector. **Ne pas les réutiliser automatiquement comme assets marketing ou applicatifs** : photographies, marques, personnages et licences peuvent nécessiter une autorisation. Préférer des visuels originaux, sous licence adéquate ou fournis par les utilisateurs selon les conditions d'utilisation.

### 6.3. Illustrations d'état vide

Style minimal et chaleureux : cartes, silhouettes d'objets génériques, étagères, éléments géométriques simples. Maximum 2–3 couleurs par illustration, avec une action claire.

---

## 7. ICONOGRAPHIE

### 7.1. Règles

- Famille recommandée : **Lucide** (ou set équivalent homogène).
- Trait : environ **2 px** sur une grille **24 × 24 px**.
- Terminaisons et angles arrondis.
- Icônes bleu profond par défaut ; couleur d'accent seulement pour les statuts ou fonctionnalités pertinentes.
- Toujours associer un libellé aux fonctions critiques, surtout dans la navigation.

### 7.2. Correspondances fonctionnelles

| Fonction | Icône indicative |
|---|---|
| Accueil | `house` |
| Mes collections | `layers-3` |
| Explorer / rechercher | `search` |
| Ajouter une pièce | `plus` / `circle-plus` |
| Souhaits | `heart` |
| Statistiques | `chart-no-axes-column-increasing` |
| Profil | `user-round` |
| Filtrer | `sliders-horizontal` |
| Trier | `arrow-down-up` |
| Favori | `heart` rempli à l'état actif |
| Photo d'objet | `camera` |

---

## 8. COMPOSANTS D'INTERFACE

### 8.1. Boutons

| Variante | Fond | Texte | Usage |
|---|---|---|---|
| **Primaire** | Bleu profond | Blanc | Ajouter, valider, enregistrer |
| **Secondaire** | Blanc | Bleu profond | Actions alternatives |
| **Accent** | Turquoise | Bleu profond | Action positive ponctuelle |
| **Tertiaire** | Transparent | Bleu profond | Navigation et actions discrètes |
| **Destructif** | Rouge foncé ou contour | Blanc / rouge foncé | Supprimer avec confirmation |

- Hauteur : **44 px** minimum, `48 px` recommandés pour les actions principales.
- Padding horizontal : 16–20 px.
- Rayon : `12 px` ; éventuellement plein arrondi pour un CTA marketing.
- `hover` : variation perceptible de fond ou bordure ; `active` : léger assombrissement ; `disabled` : apparence atténuée + attribut désactivé.
- `loading` : conserver la largeur du bouton, afficher un libellé ou indicateur explicite.
- Zone tactile : idéalement **44 × 44 px minimum**.

### 8.2. Champs de formulaire

- Hauteur standard : `48 px` ; rayon `12 px`.
- Label visible **au-dessus**, non remplacé par le seul placeholder.
- Fond blanc ; bordure `#D8E2E5` ; texte foncé.
- Focus visible de 2–3 px contrasté.
- Erreur : message sous le champ + pictogramme + couleur, jamais la couleur seule.
- Aide contextuelle : phrase courte, descriptive et actionnable.

### 8.3. Cartes de collection

**Contenu minimal :**

1. Visuel représentatif ou mosaïque d'objets.
2. Nom de la collection.
3. Compteur : `124 / 180 pièces` ou `124 pièces` si total inconnu.
4. Progression **uniquement si le total cible est défini**.
5. Action d'ouverture identifiable.

**Spécifications :** fond blanc, rayon `18 px`, bordure légère, padding 16 px, espacement 12 px. Sur mobile, une carte pleine largeur ou deux colonnes selon la densité des contenus.

### 8.4. Cartes d'objet

- Photo principale sur fond neutre, avec ratio cohérent **1:1** dans les grilles.
- Nom lisible sur 1–2 lignes.
- Métadonnées utiles : série, année, variante ou référence, selon la catégorie.
- États : `Possédé`, `Souhaité`, `En double` / quantité `x2`, si applicable.
- Marquage de statut accessible par texte et icône, pas par couleur seule.
- Actions secondaires dans un menu lorsque l'espace manque.

### 8.5. Barres de progression

- Hauteur : 8–10 px ; piste : gris bleuté clair.
- Remplissage : turquoise, ou moutarde si l'élément est purement valorisant et suffisamment visible.
- Toujours afficher la valeur textuelle à proximité : `69 % complétée` ou `124 / 180 pièces`.
- **Ne pas calculer de pourcentage si le nombre total de références est inconnu.**

### 8.6. Badges, chips et filtres

- **Possédé :** fond turquoise très clair + texte turquoise foncé.
- **Souhaité :** fond corail très clair + texte corail foncé.
- **À compléter :** fond moutarde clair + texte bleu profond.
- **Filtre actif :** fond bleu profond + texte blanc.
- **Filtre inactif :** fond blanc + contour neutre + texte foncé.
- Rayon : plein arrondi ; libellés courts, jamais fondés sur la couleur seule.

### 8.7. Navigation

**Mobile :** barre inférieure de 4 à 5 entrées maximum — par exemple Accueil, Collections, Ajouter, Souhaits, Profil. Éviter de dédoubler l'action Ajouter.

**Desktop :** barre latérale ou topbar compacte ; état sélectionné explicite par fond, libellé et indicateur, pas seulement la couleur de l'icône.

### 8.8. Modales et panneaux

- Préférer un **bottom sheet** mobile pour les actions rapides, un dialogue centré desktop.
- Titres explicites, action principale unique, fermeture visible.
- Confirmation obligatoire avant suppression irréversible.
- Gestion du focus, touche Échap et retour du focus au déclencheur.

### 8.9. Notifications et feedback

- Toast succès : « Pièce ajoutée à ta collection. »
- Erreur : « Impossible d'enregistrer cette pièce. Réessaie. »
- État vide : « Ta collection attend sa première pièce. » + CTA « Ajouter une pièce ».
- Chargement : skeleton des cartes plutôt que spinner plein écran si possible.

---

## 9. STRUCTURE DES ÉCRANS

### 9.1. Accueil / tableau de bord

1. En-tête simple + salutation contextuelle.
2. Résumé : nombre de collections, pièces possédées, souhaits.
3. Mes collections (cartes).
4. Ajouts récents.
5. Action « Ajouter une pièce » clairement disponible.

### 9.2. Liste d'une collection

- En-tête : nom, image, nombre de pièces.
- Recherche, tri et filtres.
- Grille de cartes d'objets.
- Compteurs pertinents (possédés, souhaits, doubles).
- Vue grille par défaut ; liste en option si utile.

### 9.3. Fiche d'objet

- Photographie en premier.
- Titre et informations structurées.
- Statut personnel : possédé / souhaité / non possédé, selon le modèle retenu.
- Quantité et notes si disponibles.
- Actions : ajouter à ma collection, modifier, ajouter aux souhaits.

### 9.4. Ajout d'une pièce

- Parcours court : rechercher / identifier → vérifier → ajouter.
- Préremplissage des métadonnées quand elles sont disponibles.
- Formulaire manuel possible.
- Feedback immédiat sur l'ajout.

---

## 10. RESPONSIVE

| Point de rupture indicatif | Largeur | Comportement |
|---|---:|---|
| Mobile | `< 640 px` | Navigation inférieure, une colonne principale |
| Tablette | `640–1023 px` | Grilles à 2–3 colonnes, panneaux adaptatifs |
| Desktop | `≥ 1024 px` | Navigation latérale possible, contenu multi-colonnes |

- Largeur maximale du contenu de lecture : environ **1120–1280 px** pour les vues riches.
- Ne jamais forcer 3 colonnes de cartes au détriment des photos et libellés.
- Prévoir états pour textes longs, collections vides, images absentes et compteurs élevés.
- Sur mobile, préserver les actions les plus fréquentes à portée de pouce.

---

## 11. MOUVEMENT & MICRO-INTERACTIONS

- Durée courte : **120–200 ms** pour hover et press.
- Transition de panneau : **200–300 ms**.
- Easing recommandé : `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Animation positive discrète sur l'ajout d'une pièce (petit rebond ou apparition).
- Pas d'animations permanentes sur les cartes ni de confettis systématiques.
- Respect de `prefers-reduced-motion: reduce`.

---

## 12. ACCESSIBILITÉ ET QUALITÉ

**Cible de conception : WCAG 2.2 niveau AA**, à auditer sur les parcours réels et au regard du RGAA lorsqu'applicable.

- Contraste de texte : **4,5:1 minimum** pour texte courant, **3:1** pour grands textes éligibles.
- Contraste des composants et indicateurs visuels essentiels : **3:1** lorsque requis.
- Focus clavier visible, navigation complète sans souris.
- Sémantique HTML native : boutons, liens, champs, listes, tableaux si besoin.
- Labels visibles et messages d'erreur associés aux champs.
- Images : textes alternatifs informatifs ; alt vide pour décorations.
- États exprimés aussi par le texte, pas par la couleur seule.
- Mise à l'échelle texte jusqu'à 200 %, reflow et zoom à contrôler.
- Limiter les interactions drag & drop sans alternative accessible.
- Tester avec clavier, lecteurs d'écran, mobile et mode réduction des animations.

---

## 13. TON RÉDACTIONNEL

### 13.1. Principes

**Simple, enthousiaste, précis, jamais infantilisant.** Tutoiement recommandé dans l'application, à confirmer pour la stratégie éditoriale globale.

| Éviter | Préférer |
|---|---|
| « Félicitations, tu as gagné 1 mission ! » | « Une nouvelle pièce dans ta collection ! » |
| « Aucun résultat trouvé !!! » | « Aucun objet ne correspond à ta recherche. » |
| « Tu n'as encore rien fait » | « Commence par ajouter ta première pièce. » |
| « Collection complète à 69 % » si total incertain | « 124 pièces enregistrées » |

### 13.2. Messages repères

- **Hero :** « Ta passion en un seul endroit. »
- **Description :** « Organise, suis et fais grandir tes collections. »
- **CTA principal :** « Créer ma collection ».
- **Empty state :** « Chaque collection commence par une pièce. »
- **Succès :** « C'est ajouté à ta collection ! »

---

## 14. DESIGN TOKENS — CSS

Exemple de base directement exploitable. Les tokens peuvent être transposés dans Figma Variables, Tailwind ou un système de composants.

```css
:root {
  /* Brand */
  --ks-color-deep: #0F3B46;
  --ks-color-teal: #2DB6A8;
  --ks-color-coral: #FF6B5B;
  --ks-color-mustard: #FFC83D;
  --ks-color-cream: #FFF3E6;
  --ks-color-mist: #E7EEF2;

  /* Semantic */
  --ks-bg-page: var(--ks-color-cream);
  --ks-bg-surface: #FFFFFF;
  --ks-bg-subtle: #F9F7F3;
  --ks-text-primary: #12232B;
  --ks-text-secondary: #51636A;
  --ks-text-inverse: #FFFFFF;
  --ks-border: #D8E2E5;
  --ks-link: #116B65;
  --ks-success: #116B65;
  --ks-danger: #A83C31;
  --ks-warning: #705000;

  /* Typography */
  --ks-font-heading: 'Baloo 2', ui-rounded, system-ui, sans-serif;
  --ks-font-body: 'Inter', system-ui, sans-serif;
  --ks-font-size-xs: 0.75rem;
  --ks-font-size-sm: 0.875rem;
  --ks-font-size-base: 1rem;
  --ks-font-size-lg: 1.125rem;

  /* Spacing */
  --ks-space-1: 0.25rem;
  --ks-space-2: 0.5rem;
  --ks-space-3: 0.75rem;
  --ks-space-4: 1rem;
  --ks-space-5: 1.25rem;
  --ks-space-6: 1.5rem;
  --ks-space-8: 2rem;
  --ks-space-10: 2.5rem;
  --ks-space-12: 3rem;
  --ks-space-16: 4rem;

  /* Radius */
  --ks-radius-sm: 0.5rem;
  --ks-radius-md: 0.75rem;
  --ks-radius-lg: 1.125rem;
  --ks-radius-xl: 1.5rem;
  --ks-radius-pill: 9999px;

  /* Elevation */
  --ks-shadow-card: 0 4px 18px rgb(15 59 70 / 8%);
  --ks-shadow-hover: 0 8px 24px rgb(15 59 70 / 12%);

  /* Motion */
  --ks-duration-fast: 150ms;
  --ks-duration-normal: 240ms;
  --ks-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
}

body {
  color: var(--ks-text-primary);
  background: var(--ks-bg-page);
  font-family: var(--ks-font-body);
  font-size: var(--ks-font-size-base);
  line-height: 1.5;
}

h1, h2, h3, h4 {
  color: var(--ks-color-deep);
  font-family: var(--ks-font-heading);
  line-height: 1.16;
}

.ks-button--primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--ks-color-deep);
  border-radius: var(--ks-radius-md);
  background: var(--ks-color-deep);
  color: #FFFFFF;
  font: 600 0.9375rem/1.25rem var(--ks-font-body);
  cursor: pointer;
  transition: box-shadow var(--ks-duration-fast) var(--ks-ease),
              transform var(--ks-duration-fast) var(--ks-ease);
}

.ks-button--primary:hover { box-shadow: var(--ks-shadow-hover); }
.ks-button--primary:active { transform: translateY(1px); }
.ks-button--primary:disabled { opacity: .55; cursor: not-allowed; }

:where(button, a, input, select, textarea):focus-visible {
  outline: 3px solid var(--ks-color-deep);
  outline-offset: 3px;
}

.ks-surface--dark :where(button, a, input, select, textarea):focus-visible {
  outline-color: var(--ks-color-mustard);
}

.ks-card {
  border: 1px solid var(--ks-border);
  border-radius: var(--ks-radius-lg);
  background: var(--ks-bg-surface);
  box-shadow: var(--ks-shadow-card);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 15. CHECKLIST DE VALIDATION AVANT PRODUCTION

- [ ] Recréer et valider le logo final en **SVG** (formats horizontaux et icône).
- [ ] Vérifier la lisibilité de l'app icon à **16, 32, 48, 128 et 512 px**.
- [ ] Valider Baloo 2 + Inter sur iOS, Android et web.
- [ ] Formaliser l'ensemble des états : hover, focus, active, disabled, loading, error, empty, success.
- [ ] Auditer les contrastes sur les **véritables maquettes**.
- [ ] Définir la stratégie des images catalogue et les licences associées.
- [ ] Créer une bibliothèque de composants (Figma et/ou Storybook).
- [ ] Tester les écrans clés en mobile, tablette et desktop.
- [ ] Valider la nomenclature des collections, franchises, séries et pièces avec le modèle de données.
- [ ] Vérifier les interfaces avec collections volumineuses et données manquantes.

---

## 16. RÉFÉRENCE CRÉATIVE

Moodboard retenu le **8 novembre 2026** : logo à **cartes superposées**, palette **bleu profond / turquoise / corail / moutarde / crème**, typographies **Baloo 2 + Inter**, visuels de collections, fiches d'objets et interface mobile chaleureuse.

**Synthèse de direction :** « Une application qui donne autant de plaisir à organiser ses collections qu'à les regarder. »

*Document de cadrage initial. Les recommandations chiffrées (tailles, espacements, breakpoints) constituent des valeurs de départ à tester en conception et en développement.*
