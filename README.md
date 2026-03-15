# Undercover

Jeu de société **Undercover** jouable en local sur navigateur, développé avec Svelte + TypeScript + Vite.

## Règles du jeu

### Principe

Chaque joueur reçoit secrètement un mot. La majorité des joueurs (**Civils**) reçoivent le même mot. Un ou plusieurs joueurs (**Undercover**) reçoivent un mot légèrement différent mais lié.

### Déroulement d'une partie

1. **Distribution des mots** — Chaque joueur consulte son mot à tour de rôle sur l'écran, sans le montrer aux autres.
2. **Phase de discussion** — À tour de rôle, chaque joueur donne un indice ou une description liée à son mot **sans le nommer directement**.
3. **Vote** — Les joueurs votent pour éliminer celui qu'ils soupçonnent d'être Undercover.
4. **Élimination** — Le joueur avec le plus de votes est éliminé et son rôle révélé.
5. Les phases Discussion → Vote → Élimination se répètent jusqu'à la fin de la partie.

### Conditions de victoire

- **Civils gagnent** : tous les Undercover sont éliminés.
- **Undercover gagne** : il reste autant d'Undercover que de Civils (les Civils ne peuvent plus éliminer l'Undercover en majorité).

### Conseils

- Les Civils doivent décrire leur mot de façon à être compris des autres Civils sans trop en dire.
- L'Undercover doit bluffer en donnant des indices plausibles malgré son mot différent.
- Méfiez-vous des descriptions trop vagues… ou trop précises !

---

## Lancer en local

### Prérequis

- [Node.js](https://nodejs.org/) v18+
- npm

### Installation

```bash
npm install
```

### Démarrage

```bash
npm run dev
```

L'application est accessible sur [http://localhost:5173](http://localhost:5173).

### Build de production

```bash
npm run build
npm run preview
```
