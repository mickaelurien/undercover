<script lang="ts">
  import { partieStore } from '../stores/game';

  $: joueurs = $partieStore.joueurs.filter(j => !j.éliminé);
  $: civilÉliminéNom = $partieStore.civilÉliminéNom;
</script>

<div class="screen items-center justify-between px-6 py-12">
  {#if civilÉliminéNom}
    <div class="w-full bg-orange-900/40 border border-orange-500/50 rounded-2xl px-5 py-4 text-center space-y-1">
      <p class="text-orange-300 font-bold text-base">
        ⚠️ {civilÉliminéNom} était un civil !
      </p>
      <p class="text-orange-300/70 text-sm leading-relaxed">
        L'undercover est toujours en jeu. Faites un nouveau tour d'indices, puis revotez.
      </p>
    </div>
  {/if}

  <div class="flex flex-col items-center gap-4 text-center">
    <div class="text-5xl">💬</div>
    <h1 class="text-3xl font-black text-white">Tour de discussion</h1>
    <p class="text-white/60 text-sm max-w-xs leading-relaxed">
      Chaque joueur donne un mot indice à voix haute. Soyez subtil !
    </p>
  </div>

  <div class="card w-full space-y-3">
    <h2 class="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
      Ordre de passage
    </h2>
    {#each joueurs as joueur, index}
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
          {index + 1}
        </div>
        <span class="text-white font-medium">{joueur.nom}</span>
      </div>
    {/each}
  </div>

  <div class="w-full space-y-3">
    <p class="text-center text-white/40 text-sm">
      Quand tout le monde a parlé…
    </p>
    <button class="btn-primary" on:click={() => partieStore.passerAuVote()}>
      Passer au vote
    </button>
  </div>
</div>
