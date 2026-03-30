<script lang="ts">
  import { Button, Input, Alert, Avatar } from 'flowbite-svelte';
  import { partieStore, nomsStore, configStore } from '../stores/game';
  import { validerConfiguration } from '../utils/game-logic';

  const NOM_MIN = 3;
  const NOM_MAX = 12;

  const nomParDefaut = (i: number): string => `Joueur ${i + 1}`;

  /** Initialise les noms depuis le store ou génère des noms par défaut selon la config */
  let nomsJoueurs: string[] = (() => {
    const nbCible = $configStore.nbJoueurs;
    if ($nomsStore.length === nbCible) return [...$nomsStore];
    return Array.from({ length: nbCible }, (_, i) => nomParDefaut(i));
  })();

  let erreur: string = '';

  function ajouterJoueur(): void {
    if (nomsJoueurs.length < NOM_MAX) {
      nomsJoueurs = [...nomsJoueurs, nomParDefaut(nomsJoueurs.length)];
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
    const nomsNettoyés = nomsJoueurs.map(n => n.trim());
    const messageErreur = validerConfiguration(nomsNettoyés, $configStore.nbUndercover);

    if (messageErreur !== null) {
      erreur = messageErreur;
      return;
    }

    erreur = '';
    partieStore.demarrerPartie(nomsNettoyés, $configStore.nbUndercover);
  }

  function initialesJoueur(nom: string, index: number): string {
    const n = nom.trim() || nomParDefaut(index);
    return n.slice(0, 2).toUpperCase();
  }
</script>

<div class="screen">
  <div class="flex-1 overflow-y-auto px-5 pt-14 pb-6">
    <h1 class="text-[2.6rem] font-black text-center mb-10 leading-[1.15] tracking-tight">
      Configuration des<br />Joueurs
    </h1>

    <div class="space-y-3">
      {#each nomsJoueurs as _nom, index}
        <div class="flex items-center gap-3 bg-zinc-800/80 rounded-2xl px-4 py-3">
          <Avatar class="bg-slate-700 text-indigo-400 text-xs font-bold flex-shrink-0" size="sm">
            {initialesJoueur(nomsJoueurs[index], index)}
          </Avatar>

          <Input
            type="text"
            bind:value={nomsJoueurs[index]}
            placeholder={nomParDefaut(index)}
            maxlength={20}
            class="flex-1 bg-transparent! border-0! shadow-none! ring-0! text-white! font-semibold! text-base! outline-none! placeholder-white/30! min-w-0 focus:ring-0! p-0!"
            oninput={() => (erreur = '')}
          />

          <Button
            size="sm"
            color="dark"
            class="w-9! h-9! p-0! flex items-center justify-center text-white/30 hover:text-white/70 bg-transparent! border-0! shadow-none! disabled:opacity-20"
            disabled={nomsJoueurs.length <= NOM_MIN}
            onclick={() => supprimerJoueur(index)}
            aria-label="Supprimer {nomsJoueurs[index] || nomParDefaut(index)}"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </Button>
        </div>
      {/each}

      {#if nomsJoueurs.length < NOM_MAX}
        <Button
          color="light"
          class="w-full! border-2! border-dashed! border-white/15! hover:border-white/30! bg-transparent! rounded-2xl! py-7! flex! flex-col! items-center! gap-2! transition-colors! active:bg-white/5!"
          onclick={ajouterJoueur}
        >
          <div class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xl font-light text-white/60">+</div>
          <span class="text-sm text-white/40 font-medium">Ajouter un joueur</span>
        </Button>
      {/if}
    </div>

    {#if erreur}
      <Alert color="red" class="mt-4" border>
        {erreur}
      </Alert>
    {/if}
  </div>

  <div class="px-5 pb-10 pt-4 flex gap-3">
    <button
      class="btn-secondary flex items-center justify-center gap-2 w-14 flex-shrink-0"
      on:click={() => partieStore.retourAccueil()}
      aria-label="Retour"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button class="btn-accent flex-1" on:click={validerEtLancer}>
      Commencer la partie
    </button>
  </div>
</div>
