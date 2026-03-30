<script lang="ts">
  import { Alert, Badge } from 'flowbite-svelte';
  import { partieStore } from '../stores/game';

  $: joueurs = $partieStore.joueurs.filter(j => !j.éliminé);
  $: civilÉliminéNom = $partieStore.civilÉliminéNom;

  let cibleSelectionnée: string | null = null;

  function selectionner(id: string): void {
    cibleSelectionnée = cibleSelectionnée === id ? null : id;
  }

  function confirmerÉlimination(): void {
    if (cibleSelectionnée) {
      partieStore.éliminer(cibleSelectionnée);
    }
  }
</script>

<div class="screen px-5 pt-14 pb-10">
  {#if civilÉliminéNom}
    <Alert color="yellow" class="mb-4 text-center" border>
      <span class="font-bold">{civilÉliminéNom} était un civil !</span>
      <br />
      <span class="text-sm leading-relaxed">L'undercover est toujours en jeu. Revotez pour l'éliminer.</span>
    </Alert>
  {/if}

  <div class="mb-6">
    <h1 class="text-5xl font-black leading-tight">
      Qui est le<br /><span class="text-red-400">suspect ?</span>
    </h1>
    <p class="text-white/50 text-base mt-2 leading-snug">
      Votez à l'unanimité pour éliminer un joueur.
    </p>
  </div>

  <div class="flex-1 overflow-y-auto">
    <div class="grid grid-cols-2 gap-3 p-1 pb-4">
      {#each joueurs as joueur}
        {@const selectionne = cibleSelectionnée === joueur.id}
        <button
          class="relative rounded-2xl p-4 text-left overflow-hidden transition-all duration-150 min-h-[130px] flex flex-col justify-between"
          class:bg-zinc-800={!selectionne}
          class:bg-red-950={selectionne}
          style={selectionne ? 'box-shadow: 0 0 0 2px #f87171;' : ''}
          on:click={() => selectionner(joueur.id)}
        >
          <div class="flex justify-between items-start w-full">
            {#if selectionne}
              <Badge color="red" class="text-[10px]! font-black! uppercase! tracking-widest!">Suspect</Badge>
              <div class="w-6 h-6 rounded-full bg-red-400 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12l5 5L20 7" stroke="#0a0a0f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            {:else}
              <span></span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" class="text-white/20" aria-hidden="true">
                <circle cx="12" cy="8" r="4" fill="currentColor"/>
                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            {/if}
          </div>

          <p class="text-2xl font-black text-white leading-none">{joueur.nom}</p>

          {#if selectionne}
            <svg
              class="absolute -right-3 bottom-0 w-28 h-28 text-red-400/15 pointer-events-none"
              viewBox="0 0 100 100"
              fill="none"
              aria-hidden="true"
            >
              <ellipse cx="50" cy="65" rx="7" ry="8" stroke="currentColor" stroke-width="2"/>
              <ellipse cx="50" cy="67" rx="15" ry="17" stroke="currentColor" stroke-width="2"/>
              <ellipse cx="50" cy="69" rx="23" ry="26" stroke="currentColor" stroke-width="2"/>
              <ellipse cx="50" cy="71" rx="31" ry="35" stroke="currentColor" stroke-width="2"/>
              <ellipse cx="50" cy="73" rx="39" ry="44" stroke="currentColor" stroke-width="2"/>
              <ellipse cx="50" cy="75" rx="47" ry="53" stroke="currentColor" stroke-width="2"/>
            </svg>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <div class="flex flex-col gap-4 pt-2">
    <button
      class="btn-vote"
      disabled={!cibleSelectionnée}
      on:click={confirmerÉlimination}
    >
      Valider le vote
    </button>
  </div>
</div>
