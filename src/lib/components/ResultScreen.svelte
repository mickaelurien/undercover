<script lang="ts">
  import { Card, Badge, Button } from 'flowbite-svelte';
  import { partieStore } from '../stores/game';
  import type { Joueur } from '../types';

  $: etat = $partieStore;
  $: civils = etat.gagnant === 'CIVILS';

  $: nomsUndercover = etat.joueurs
    .filter(j => j.role === 'UNDERCOVER')
    .map(j => j.nom)
    .join(', ');

  const messageVictoire: Record<string, { titre: string; corps: string }> = {
    CIVILS: {
      titre: "Les Civils ont su démasquer l'intrus avec brio.",
      corps: 'Le groupe a joué collectif. Félicitations !',
    },
    UNDERCOVER: {
      titre: "L'Undercover a semé le doute jusqu'au bout.",
      corps: 'Le bluff a parfaitement fonctionné. Impressionnant.',
    },
  };

  $: message = messageVictoire[etat.gagnant ?? 'CIVILS'];

  const configRole: Record<string, { label: string; badgeColor: string }> = {
    CIVIL: { label: 'Civil', badgeColor: 'indigo' },
    UNDERCOVER: { label: 'Undercover', badgeColor: 'red' },
    MR_WHITE: { label: 'Mr. White', badgeColor: 'gray' },
  };

  function infoRole(joueur: Joueur) {
    return configRole[joueur.role] ?? configRole['CIVIL'];
  }

  function motJoueur(joueur: Joueur): string {
    return joueur.role === 'MR_WHITE' ? '— Aucun —' : (joueur.mot ?? '—');
  }
</script>

<div class="screen px-5 pt-14 pb-10">
  <div class="mb-8">
    {#if civils}
      <h1 class="text-5xl font-black leading-tight">
        Les Civils ont<br /><span class="text-indigo-400">gagné !</span>
      </h1>
    {:else}
      <h1 class="text-5xl font-black leading-tight">
        <span class="text-red-400">L'Undercover</span><br />a gagné !
      </h1>
    {/if}
    <p class="text-white/50 text-base mt-2">
      L'Undercover était <strong class="text-white">{nomsUndercover}</strong>.
    </p>
  </div>

  <div class="flex-1 overflow-y-auto space-y-3 pb-4">
    {#each etat.joueurs as joueur}
      {@const info = infoRole(joueur)}
      <Card class="bg-zinc-800/80! border-0! rounded-2xl! px-4! py-4! gap-0">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xl font-black text-white leading-tight">{joueur.nom}</p>
            <Badge color={info.badgeColor} class="mt-1 uppercase! tracking-widest! text-[10px]!">
              {info.label}
            </Badge>
          </div>

          {#if joueur.role === 'CIVIL'}
            <div class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12l5 5L20 7" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          {:else if joueur.role === 'UNDERCOVER'}
            <div class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          {:else}
            <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="8" stroke="white" stroke-width="2" opacity="0.4"/>
                <path d="M21 21l-4.35-4.35" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
              </svg>
            </div>
          {/if}
        </div>

        <div class="mt-3 pt-3 border-t border-white/5">
          <p class="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">Mot</p>
          <p class="text-sm font-semibold {joueur.role === 'MR_WHITE' ? 'text-white/30 italic' : 'text-white'}">
            {motJoueur(joueur)}
          </p>
        </div>
      </Card>
    {/each}

    <div
      class="rounded-2xl px-5 py-5 mt-2 relative overflow-hidden"
      style="background: radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.15) 0%, rgba(15,15,25,0) 70%), #18181b;"
    >
      <div
        class="absolute right-8 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-10"
        style="background: radial-gradient(circle, white 0%, transparent 70%);"
        aria-hidden="true"
      ></div>
      <p class="text-indigo-400 font-black text-lg leading-snug relative z-10">
        {message.titre}
      </p>
      <p class="text-white/30 text-xs mt-1 leading-relaxed relative z-10">
        {message.corps}
      </p>
    </div>
  </div>

  <div class="flex flex-col gap-3 pt-4">
    <button class="btn-accent" on:click={() => partieStore.nouvellePartie()}>
      Nouvelle partie
    </button>
    <Button
      color="light"
      class="w-full! bg-transparent! border-0! text-white/60! hover:text-white! font-semibold! text-base! shadow-none!"
      onclick={() => partieStore.rejouerMêmesJoueurs()}
    >
      Rejouer avec les mêmes joueurs
    </Button>
  </div>
</div>
