<script lang="ts">
  import { partieStore } from '../stores/game';

  $: joueurs = $partieStore.joueurs.filter(j => !j.éliminé);

  let cibleSelectionnée: string | null = null;

  function confirmerÉlimination(): void {
    if (cibleSelectionnée) {
      partieStore.éliminer(cibleSelectionnée);
    }
  }
</script>

<div class="screen">
  <div class="flex items-center gap-4 px-6 pt-8 pb-4">
    <div class="w-9 h-9 rounded-full bg-yellow-900/50 flex items-center justify-center text-lg">
      🗳️
    </div>
    <div>
      <h1 class="text-xl font-bold leading-tight">Qui est éliminé ?</h1>
      <p class="text-white/40 text-sm">Vote collectif — sélectionnez le joueur</p>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
    {#each joueurs as joueur}
      <button
        class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-150
          {cibleSelectionnée === joueur.id
            ? 'border-red-500 bg-red-900/30'
            : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'}"
        on:click={() => (cibleSelectionnée = joueur.id)}
      >
        <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg flex-shrink-0">
          {joueur.nom[0].toUpperCase()}
        </div>
        <span class="font-semibold text-lg">{joueur.nom}</span>
        {#if cibleSelectionnée === joueur.id}
          <span class="ml-auto text-red-400 text-xl">✓</span>
        {/if}
      </button>
    {/each}
  </div>

  <div class="px-6 pb-8 pt-4">
    <button
      class="btn-danger disabled:opacity-40 disabled:cursor-not-allowed"
      disabled={!cibleSelectionnée}
      on:click={confirmerÉlimination}
    >
      Confirmer l'élimination
    </button>
  </div>
</div>
