import type { Joueur } from '../types';

/**
 * Mélange un tableau avec l'algorithme Fisher-Yates
 * @param tableau Le tableau à mélanger
 */
export function melangerTableau<T>(tableau: T[]): T[] {
  const copie = [...tableau];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

/**
 * Vérifie les conditions de victoire après une élimination.
 * @param joueursActifs Joueurs encore en jeu (non éliminés)
 * @returns 'CIVILS' si tous les undercovers éliminés, 'UNDERCOVER' si parité atteinte, null si la partie continue
 */
export function verifierVictoire(joueursActifs: Joueur[]): 'CIVILS' | 'UNDERCOVER' | null {
  const nbUndercover = joueursActifs.filter(j => j.role === 'UNDERCOVER').length;
  const nbCivils = joueursActifs.filter(j => j.role === 'CIVIL').length;

  if (nbUndercover === 0) return 'CIVILS';
  if (nbUndercover >= nbCivils) return 'UNDERCOVER';
  return null;
}

/**
 * Valide la configuration avant de lancer une partie.
 * @param noms Liste des noms des joueurs (déjà trimés)
 * @param nbUndercover Nombre d'undercovers souhaités
 * @returns Message d'erreur ou null si valide
 */
export function validerConfiguration(noms: string[], nbUndercover: number): string | null {
  if (noms.some(n => n === '')) {
    return 'Tous les joueurs doivent avoir un prénom.';
  }

  const nomsUniques = new Set(noms.map(n => n.toLowerCase()));
  if (nomsUniques.size !== noms.length) {
    return 'Deux joueurs ne peuvent pas avoir le même prénom.';
  }

  const nbUndercoverMax = Math.floor(noms.length / 3);
  if (nbUndercover > nbUndercoverMax) {
    return `Pour ${noms.length} joueurs, maximum ${nbUndercoverMax} undercover.`;
  }

  return null;
}
