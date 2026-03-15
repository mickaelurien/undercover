export type Phase =
  | 'ACCUEIL'
  | 'CONFIGURATION'
  | 'DISTRIBUTION_MOTS'
  | 'DISCUSSION'
  | 'VOTE'
  | 'RESULTAT';

export type Role = 'CIVIL' | 'UNDERCOVER';

export interface Joueur {
  id: string;
  nom: string;
  role: Role;
  mot: string;
  éliminé: boolean;
}

export interface PaireMots {
  motCivil: string;
  motUndercover: string;
}

export interface EtatPartie {
  phase: Phase;
  joueurs: Joueur[];
  indexJoueurCourant: number;
  paireMots: PaireMots | null;
  motVisible: boolean;
  joueursÉliminés: Joueur[];
  gagnant: 'CIVILS' | 'UNDERCOVER' | null;
  /** Nom du civil éliminé au tour précédent, null sinon */
  civilÉliminéNom: string | null;
}
