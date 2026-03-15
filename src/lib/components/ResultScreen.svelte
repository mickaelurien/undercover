<script lang="ts">
  import { partieStore } from '../stores/game';

  $: etat = $partieStore;
  $: gagnant = etat.gagnant;
  $: paire = etat.paireMots;
  $: civils = gagnant === 'CIVILS';
  $: dernierÉliminé = etat.joueursÉliminés.at(-1) ?? null;

  let motsCachés = true;
</script>

<div class="screen items-center justify-between px-6 py-12">
  <div class="flex flex-col items-center gap-6 text-center w-full">
    <div class="text-6xl">
      {civils ? '🎉' : '😈'}
    </div>

    <div class="space-y-1">
      <h1 class="text-4xl font-black {civils ? 'text-green-400' : 'text-red-400'}">
        {civils ? 'Les civils gagnent !' : "L'undercover gagne !"}
      </h1>
    </div>

    {#if dernierÉliminé}
      <div class="card w-full text-center space-y-3">
        <p class="text-white/50 text-sm uppercase tracking-wider">Dernier éliminé</p>
        <p class="text-3xl font-black text-white">{dernierÉliminé.nom}</p>
        <div class="inline-block px-4 py-1.5 rounded-full text-sm font-bold
          {dernierÉliminé.role === 'UNDERCOVER'
            ? 'bg-red-900/50 text-red-300 border border-red-500/50'
            : 'bg-blue-900/50 text-blue-300 border border-blue-500/50'}">
          {dernierÉliminé.role === 'UNDERCOVER' ? '🕵️ UNDERCOVER' : '👥 CIVIL'}
        </div>
      </div>
    {/if}

    {#if etat.joueursÉliminés.length > 1}
      <div class="card w-full space-y-2">
        <p class="text-white/50 text-xs uppercase tracking-wider mb-1">Historique des éliminations</p>
        {#each etat.joueursÉliminés as éliminé, i}
          <div class="flex items-center gap-3 py-1">
            <span class="text-white/30 text-xs w-4">{i + 1}</span>
            <span class="font-medium">{éliminé.nom}</span>
            <span class="ml-auto text-xs px-2 py-0.5 rounded-full
              {éliminé.role === 'UNDERCOVER'
                ? 'bg-red-900/50 text-red-300'
                : 'bg-blue-900/50 text-blue-300'}">
              {éliminé.role}
            </span>
          </div>
        {/each}
      </div>
    {/if}

    <div class="card w-full space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-white/50 text-sm uppercase tracking-wider">Les mots</p>
        <button
          class="text-primary-400 text-sm font-semibold"
          on:click={() => (motsCachés = !motsCachés)}
        >
          {motsCachés ? 'Révéler' : 'Cacher'}
        </button>
      </div>

      {#if !motsCachés && paire}
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
            <p class="text-xs text-blue-400/70 uppercase tracking-wider mb-1">Civil</p>
            <p class="text-xl font-bold text-blue-300">{paire.motCivil}</p>
          </div>
          <div class="bg-red-900/30 rounded-xl p-4 border border-red-500/30">
            <p class="text-xs text-red-400/70 uppercase tracking-wider mb-1">Undercover</p>
            <p class="text-xl font-bold text-red-300">{paire.motUndercover}</p>
          </div>
        </div>

        <div class="space-y-2 pt-2">
          <p class="text-xs text-white/40 uppercase tracking-wider">Rôles de chacun</p>
          {#each etat.joueurs as joueur}
            <div class="flex items-center justify-between py-1 {joueur.éliminé ? 'opacity-40' : ''}">
              <div class="flex items-center gap-2">
                {#if joueur.éliminé}
                  <span class="text-xs text-white/30">✕</span>
                {/if}
                <span class="font-medium">{joueur.nom}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-white/50">{joueur.mot}</span>
                <span class="text-xs px-2 py-0.5 rounded-full
                  {joueur.role === 'UNDERCOVER'
                    ? 'bg-red-900/50 text-red-300'
                    : 'bg-blue-900/50 text-blue-300'}">
                  {joueur.role}
                </span>
              </div>
            </div>
          {/each}
        </div>
      {:else if motsCachés}
        <p class="text-white/30 text-sm text-center py-2">
          Appuie sur Révéler pour voir les mots et les rôles
        </p>
      {/if}
    </div>
  </div>

  <div class="w-full space-y-3 mt-4">
    <button class="btn-primary" on:click={() => partieStore.nouvellePartie()}>
      Nouvelle partie
    </button>
    <button class="btn-secondary" on:click={() => partieStore.retourAccueil()}>
      Accueil
    </button>
  </div>
</div>
