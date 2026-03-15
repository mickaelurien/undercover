import { describe, it, expect } from 'vitest';
import { melangerTableau, verifierVictoire, validerConfiguration } from '../src/lib/utils/game-logic';
import type { Joueur } from '../src/lib/types';

// --- Helpers ---

function creerJoueur(id: string, role: 'CIVIL' | 'UNDERCOVER', éliminé = false): Joueur {
  return { id, nom: `Joueur ${id}`, role, mot: 'test', éliminé };
}

// --- melangerTableau ---

describe('melangerTableau', () => {
  it('retourne un tableau de même longueur', () => {
    const tableau = [1, 2, 3, 4, 5];
    expect(melangerTableau(tableau)).toHaveLength(5);
  });

  it('contient les mêmes éléments que l\'original', () => {
    const tableau = [1, 2, 3, 4, 5];
    expect(melangerTableau(tableau).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('ne modifie pas le tableau original', () => {
    const tableau = [1, 2, 3];
    melangerTableau(tableau);
    expect(tableau).toEqual([1, 2, 3]);
  });

  it('gère un tableau vide', () => {
    expect(melangerTableau([])).toEqual([]);
  });

  it('gère un tableau d\'un seul élément', () => {
    expect(melangerTableau(['a'])).toEqual(['a']);
  });
});

// --- verifierVictoire ---

describe('verifierVictoire', () => {
  it('retourne CIVILS quand tous les undercovers sont éliminés', () => {
    const joueursActifs = [
      creerJoueur('1', 'CIVIL'),
      creerJoueur('2', 'CIVIL'),
    ];
    expect(verifierVictoire(joueursActifs)).toBe('CIVILS');
  });

  it('retourne UNDERCOVER quand nb undercover >= nb civils', () => {
    const joueursActifs = [
      creerJoueur('1', 'UNDERCOVER'),
      creerJoueur('2', 'CIVIL'),
    ];
    expect(verifierVictoire(joueursActifs)).toBe('UNDERCOVER');
  });

  it('retourne UNDERCOVER quand nb undercover > nb civils', () => {
    const joueursActifs = [
      creerJoueur('1', 'UNDERCOVER'),
      creerJoueur('2', 'UNDERCOVER'),
      creerJoueur('3', 'CIVIL'),
    ];
    expect(verifierVictoire(joueursActifs)).toBe('UNDERCOVER');
  });

  it('retourne null quand la partie continue', () => {
    const joueursActifs = [
      creerJoueur('1', 'UNDERCOVER'),
      creerJoueur('2', 'CIVIL'),
      creerJoueur('3', 'CIVIL'),
      creerJoueur('4', 'CIVIL'),
    ];
    expect(verifierVictoire(joueursActifs)).toBeNull();
  });

  it('retourne CIVILS quand aucun joueur (bord)', () => {
    expect(verifierVictoire([])).toBe('CIVILS');
  });
});

// --- validerConfiguration ---

describe('validerConfiguration', () => {
  it('accepte une configuration valide', () => {
    expect(validerConfiguration(['Alice', 'Bob', 'Charlie'], 1)).toBeNull();
  });

  it('rejette si un nom est vide', () => {
    expect(validerConfiguration(['Alice', '', 'Charlie'], 1)).toBeTruthy();
  });

  it('rejette si deux joueurs ont le même nom (case-insensitive)', () => {
    const erreur = validerConfiguration(['Alice', 'alice', 'Bob'], 1);
    expect(erreur).toBeTruthy();
  });

  it('rejette si nbUndercover dépasse le maximum autorisé', () => {
    // 3 joueurs → max floor(3/3) = 1 undercover
    const erreur = validerConfiguration(['A', 'B', 'C'], 2);
    expect(erreur).toBeTruthy();
  });

  it('accepte nbUndercover = floor(nbJoueurs / 3)', () => {
    // 6 joueurs → max 2 undercovers
    expect(validerConfiguration(['A', 'B', 'C', 'D', 'E', 'F'], 2)).toBeNull();
  });

  it('inclut le nombre de joueurs et le maximum dans le message d\'erreur', () => {
    const erreur = validerConfiguration(['A', 'B', 'C'], 2);
    expect(erreur).toContain('3');
    expect(erreur).toContain('1');
  });
});
