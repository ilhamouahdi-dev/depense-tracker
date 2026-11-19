#  Gestionnaire de dépenses

Application web simple pour noter ses dépenses, les filtrer, suivre un budget mensuel et visualiser la répartition par catégorie.

**Démo :** `https://ilhamouahdi-dev.github.io/depense-tracker/`

## Fonctionnalités
- Ajouter / supprimer une dépense (titre, montant, catégorie, date)
- Validation des champs avant enregistrement
- Filtre par catégorie et par mois
- Total recalculé automatiquement
- Alerte quand le budget mensuel est dépassé
- Graphique en anneau par catégorie (Chart.js)
- Export des dépenses affichées en CSV (ouvrable dans Excel)
- Données conservées dans le navigateur (`localStorage`)

## Technologies
HTML5 · CSS3 (flexbox, grid, responsive) · JavaScript (ES6, DOM) · Chart.js · localStorage

## Structure
| Fichier | Rôle |
|---|---|
| `index.html` | Structure de la page |
| `style.css` | Mise en forme |
| `logic.js` | Calculs et validations (sans DOM, testables) |
| `script.js` | Interface : formulaire, affichage, localStorage |
| `test/logic.test.js` | Tests automatiques de `logic.js` |

## Lancer le projet
Ouvrir `index.html` dans un navigateur (ou utiliser l'extension *Live Server* de VS Code).

## Lancer les tests
```bash
node test/logic.test.js
```

## Idées d'amélioration
Modifier une dépense, trier les colonnes, version avec backend (Node.js + MySQL), version React.
