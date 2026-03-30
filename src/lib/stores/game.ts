import { writable, derived } from "svelte/store";
import type { EtatPartie, Joueur, PaireMots, ConfigPartie } from "../types";
import { melangerTableau, verifierVictoire } from "../utils/game-logic";
import pairesMotsJson from "../data/words.json";

/** Noms des joueurs conservés entre les parties */
export const nomsStore = writable<string[]>([]);

/** Configuration globale de la partie (persistée entre les sessions) */
export const configStore = writable<ConfigPartie>({
    nbJoueurs: 8,
    nbUndercover: 2,
    nbMrWhite: 1,
});

const pairsMots: PaireMots[] = pairesMotsJson as PaireMots[];

const etatInitial: EtatPartie = {
    phase: "ACCUEIL",
    joueurs: [],
    indexJoueurCourant: 0,
    paireMots: null,
    motVisible: false,
    joueursÉliminés: [],
    gagnant: null,
    civilÉliminéNom: null,
};

function creerStore() {
    const { subscribe, set, update } = writable<EtatPartie>(etatInitial);

    /**
     * Lance une nouvelle partie en assignant les rôles et les mots à chaque joueur.
     * Un ou plusieurs joueurs sont désignés Undercover de manière aléatoire.
     * @param nomsJoueurs Liste des prénoms des joueurs
     * @param nbUndercover Nombre de joueurs undercover (défaut : 1)
     */
    function demarrerPartie(
        nomsJoueurs: string[],
        nbUndercover: number = 1,
    ): void {
        nomsStore.set(nomsJoueurs);
        const paire = pairsMots[Math.floor(Math.random() * pairsMots.length)];
        const indices = melangerTableau(
            Array.from({ length: nomsJoueurs.length }, (_, i) => i),
        );
        const indicesUndercover = new Set(indices.slice(0, nbUndercover));

        const joueurs: Joueur[] = nomsJoueurs.map((nom, i) => ({
            id: crypto.randomUUID(),
            nom,
            role: indicesUndercover.has(i) ? "UNDERCOVER" : "CIVIL",
            mot: indicesUndercover.has(i)
                ? paire.motUndercover
                : paire.motCivil,
            éliminé: false,
        }));

        set({
            phase: "DISTRIBUTION_MOTS",
            joueurs: melangerTableau(joueurs),
            indexJoueurCourant: 0,
            paireMots: paire,
            motVisible: false,
            joueursÉliminés: [],
            gagnant: null,
            civilÉliminéNom: null,
        });
    }

    /** Affiche le mot du joueur courant */
    function révélerMot(): void {
        update((etat) => ({ ...etat, motVisible: true }));
    }

    /** Cache le mot du joueur courant */
    function cacherMot(): void {
        update((etat) => ({ ...etat, motVisible: false }));
    }

    /**
     * Passe au joueur suivant pendant la distribution des mots.
     * Quand tous les joueurs ont vu leur mot, passe directement à la phase Vote.
     */
    function joueurSuivantDistribution(): void {
        update((etat) => {
            const prochaineIndex = etat.indexJoueurCourant + 1;
            if (prochaineIndex >= etat.joueurs.length) {
                return {
                    ...etat,
                    phase: "VOTE",
                    indexJoueurCourant: 0,
                    motVisible: false,
                };
            }
            return {
                ...etat,
                indexJoueurCourant: prochaineIndex,
                motVisible: false,
            };
        });
    }

    /**
     * Élimine le joueur sélectionné, puis vérifie les conditions de victoire.
     * - Tous les undercoverss éliminés → civils gagnent
     * - Autant d'undercoverss que de civils restants → undercover gagne
     * - Sinon → retour à la phase Vote sans le joueur éliminé
     * @param cibleId L'identifiant du joueur à éliminer
     */
    function éliminer(cibleId: string): void {
        update((etat) => {
            const joueurEliminé = etat.joueurs.find(
                (j) => j.id === cibleId && !j.éliminé,
            );
            if (!joueurEliminé) return etat;

            const joueursMisAJour = etat.joueurs.map((j) =>
                j.id === cibleId ? { ...j, éliminé: true } : j,
            );
            const joueursÉliminés = [...etat.joueursÉliminés, joueurEliminé];
            const joueursActifs = joueursMisAJour.filter((j) => !j.éliminé);

            const victoire = verifierVictoire(joueursActifs);

            if (victoire !== null) {
                return {
                    ...etat,
                    joueurs: joueursMisAJour,
                    joueursÉliminés,
                    phase: "RESULTAT",
                    gagnant: victoire,
                    civilÉliminéNom: null,
                };
            }

            const nomCivilÉliminé =
                joueurEliminé.role === "CIVIL" ? joueurEliminé.nom : null;
            return {
                ...etat,
                joueurs: joueursMisAJour,
                joueursÉliminés,
                phase: "VOTE",
                civilÉliminéNom: nomCivilÉliminé,
            };
        });
    }

    /** Réinitialise l'application vers l'écran d'accueil */
    function retourAccueil(): void {
        set(etatInitial);
    }

    /** Navigue vers l'écran de configuration */
    function nouvellePartie(): void {
        update(() => ({ ...etatInitial, phase: "CONFIGURATION" }));
    }

    /**
     * Relance une partie avec les mêmes joueurs et la même config.
     * Bypass l'écran de configuration et redistribue directement les rôles.
     */
    function rejouerMêmesJoueurs(): void {
        let noms: string[] = [];
        let nbUndercover = 1;
        nomsStore.subscribe((v) => {
            noms = v;
        })();
        configStore.subscribe((c) => {
            nbUndercover = c.nbUndercover;
        })();
        if (noms.length >= 3) {
            demarrerPartie(noms, nbUndercover);
        } else {
            nouvellePartie();
        }
    }

    return {
        subscribe,
        demarrerPartie,
        révélerMot,
        cacherMot,
        joueurSuivantDistribution,
        éliminer,
        retourAccueil,
        nouvellePartie,
        rejouerMêmesJoueurs,
    };
}

export const partieStore = creerStore();

export const joueurCourant = derived(
    partieStore,
    ($etat) => $etat.joueurs[$etat.indexJoueurCourant] ?? null,
);
