<script lang="ts">
  import { partieStore, joueurCourant } from '../stores/game';

  $: joueur = $joueurCourant;
  $: motVisible = $partieStore.motVisible;
  $: totalJoueurs = $partieStore.joueurs.length;
  $: indexCourant = $partieStore.indexJoueurCourant;
</script>

<div class="screen items-center justify-center relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></div>

  {#if !motVisible}
    <div class="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
      <div class="space-y-2">
        <p class="text-white/50 text-sm font-medium uppercase tracking-widest">
          {indexCourant + 1} / {totalJoueurs}
        </p>
        <div class="w-20 h-20 rounded-full bg-primary-800/50 border-2 border-primary-500/50 flex items-center justify-center text-3xl mx-auto">
          👤
        </div>
        <h2 class="text-3xl font-black text-white mt-4">
          Passe le téléphone à
        </h2>
        <p class="text-4xl font-black text-primary-400">
          {joueur?.nom}
        </p>
      </div>

      <p class="text-white/40 text-sm max-w-xs leading-relaxed">
        Les autres joueurs ne doivent pas regarder l'écran
      </p>

      <button
        class="btn-primary max-w-xs w-full"
        on:click={() => partieStore.révélerMot()}
      >
        Révéler mon mot
      </button>
    </div>
  {:else}
    <div class="relative z-10 flex flex-col items-center gap-8 px-8 text-center w-full max-w-sm">
      <p class="text-white/50 text-sm font-medium uppercase tracking-widest">
        Ton mot secret
      </p>

      <div class="w-full card flex flex-col items-center gap-4 py-10">
        <p class="text-5xl font-black text-white tracking-tight">
          {joueur?.mot}
        </p>
      </div>

    </div>
  {/if}
</div>

{#if !motVisible && indexCourant > 0}
  <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
    <div
      class="h-full bg-primary-500 transition-all duration-500"
      style="width: {(indexCourant / totalJoueurs) * 100}%"
    ></div>
  </div>
{/if}

{#if !motVisible}
  <!-- Bouton de passage au joueur suivant — visible uniquement après avoir caché le mot -->
{:else}
  <div class="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-gray-950 z-20">
    <button
      class="btn-primary"
      on:click={() => partieStore.joueurSuivantDistribution()}
    >
      {indexCourant + 1 < totalJoueurs ? 'Joueur suivant' : 'Commencer la discussion'}
    </button>
  </div>
{/if}
