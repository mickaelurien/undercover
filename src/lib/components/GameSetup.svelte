<script lang="ts">
  import { partieStore, nomsStore } from '../stores/game';

  const NOM_MIN = 3;
  const NOM_MAX = 10;
  const NB_UNDERCOVER_MAX = 2;

  let nomsJoueurs: string[] = $nomsStore.length >= NOM_MIN ? [...$nomsStore] : ['', '', ''];
  let nbUndercover: number = 1;
  let erreur: string = '';

  function ajouterJoueur(): void {
    if (nomsJoueurs.length < NOM_MAX) {
      nomsJoueurs = [...nomsJoueurs, ''];
    }
  }

  function supprimerJoueur(index: number): void {
    if (nomsJoueurs.length > NOM_MIN) {
      nomsJoueurs = nomsJoueurs.filter((_, i) => i !== index);
    }
  }

  /**
   * Valide la configuration et lance la partie.
   * Vérifie que tous les noms sont renseignés et uniques.
   */
  function validerEtLancer(): void {
    erreur = '';
    const nomsNettoyés = nomsJoueurs.map(n => n.trim());

    if (nomsNettoyés.some(n => n === '')) {
      erreur = 'Tous les joueurs doivent avoir un prénom.';
      return;
    }

    const nomsUniques = new Set(nomsNettoyés.map(n => n.toLowerCase()));
    if (nomsUniques.size !== nomsNettoyés.length) {
      erreur = 'Deux joueurs ne peuvent pas avoir le même prénom.';
      return;
    }

    const nbUndercoverMax = Math.floor(nomsNettoyés.length / 3);
    if (nbUndercover > nbUndercoverMax) {
      erreur = `Pour ${nomsNettoyés.length} joueurs, maximum ${nbUndercoverMax} undercover.`;
      return;
    }

    partieStore.demarrerPartie(nomsNettoyés, nbUndercover);
  }

  $: nbUndercoverMax = Math.max(1, Math.min(NB_UNDERCOVER_MAX, Math.floor(nomsJoueurs.length / 3)));
  $: if (nbUndercover > nbUndercoverMax) nbUndercover = nbUndercoverMax;
</script>

<div class="screen">
  <div class="flex items-center gap-4 px-6 pt-8 pb-4">
    <button
      class="text-white/60 hover:text-white p-2 -ml-2 transition-colors"
      on:click={() => partieStore.retourAccueil()}
      aria-label="Retour"
    >
      ←
    </button>
    <h1 class="text-2xl font-bold">Nouvelle partie</h1>
  </div>

  <div class="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
    <div class="space-y-3">
      <h2 class="text-sm font-semibold text-white/60 uppercase tracking-wider">
        Joueurs ({nomsJoueurs.length})
      </h2>

      {#each nomsJoueurs as nom, index}
        <div class="flex gap-2 items-center">
          <div class="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {index + 1}
          </div>
          <input
            type="text"
            bind:value={nomsJoueurs[index]}
            placeholder="Prénom du joueur {index + 1}"
            maxlength="20"
            class="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-500 transition-colors"
            on:input={() => (erreur = '')}
          />
          {#if nomsJoueurs.length > NOM_MIN}
            <button
              class="w-8 h-8 rounded-full bg-red-900/50 hover:bg-red-700 flex items-center justify-center text-red-400 hover:text-white transition-colors flex-shrink-0"
              on:click={() => supprimerJoueur(index)}
              aria-label="Supprimer {nom || 'ce joueur'}"
            >
              ✕
            </button>
          {/if}
        </div>
      {/each}

      {#if nomsJoueurs.length < NOM_MAX}
        <button
          class="w-full py-3 border-2 border-dashed border-white/20 hover:border-primary-500 rounded-xl text-white/40 hover:text-primary-400 transition-colors text-sm font-medium"
          on:click={ajouterJoueur}
        >
          + Ajouter un joueur
        </button>
      {/if}
    </div>

    <div class="card space-y-3">
      <h2 class="text-sm font-semibold text-white/60 uppercase tracking-wider">
        Undercover(s)
      </h2>
      <div class="flex items-center justify-between">
        <span class="text-white">Nombre d'undercover</span>
        <div class="flex items-center gap-3">
          <button
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold transition-colors disabled:opacity-30"
            on:click={() => (nbUndercover = Math.max(1, nbUndercover - 1))}
            disabled={nbUndercover <= 1}
            aria-label="Diminuer"
          >
            −
          </button>
          <span class="text-xl font-bold w-6 text-center">{nbUndercover}</span>
          <button
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold transition-colors disabled:opacity-30"
            on:click={() => (nbUndercover = Math.min(nbUndercoverMax, nbUndercover + 1))}
            disabled={nbUndercover >= nbUndercoverMax}
            aria-label="Augmenter"
          >
            +
          </button>
        </div>
      </div>
      <p class="text-xs text-white/40">
        Maximum {nbUndercoverMax} pour {nomsJoueurs.length} joueurs
      </p>
    </div>

    {#if erreur}
      <div class="bg-red-900/30 border border-red-500/50 rounded-xl px-4 py-3 text-red-300 text-sm">
        {erreur}
      </div>
    {/if}
  </div>

  <div class="px-6 pb-8 pt-4">
    <button class="btn-primary" on:click={validerEtLancer}>
      Lancer la partie
    </button>
  </div>
</div>
