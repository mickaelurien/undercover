<script lang="ts">
  import { Button, Badge, Progressbar } from 'flowbite-svelte';
  import { partieStore, joueurCourant } from '../stores/game';

  $: joueur = $joueurCourant;
  $: motVisible = $partieStore.motVisible;
  $: totalJoueurs = $partieStore.joueurs.length;
  $: indexCourant = $partieStore.indexJoueurCourant;

  let aRevele = false;
  let timerReveler: ReturnType<typeof setTimeout> | null = null;
  let progression = 0;
  let animationFrame: number | null = null;
  let debutHold: number | null = null;
  const DUREE_HOLD = 500;

  function commencerReveler(): void {
    if (timerReveler) return;
    debutHold = Date.now();
    progression = 0;

    const animer = () => {
      if (debutHold === null) return;
      progression = Math.min((Date.now() - debutHold) / DUREE_HOLD, 1);
      if (progression < 1) {
        animationFrame = requestAnimationFrame(animer);
      }
    };
    animationFrame = requestAnimationFrame(animer);

    timerReveler = setTimeout(() => {
      partieStore.révélerMot();
      aRevele = true;
      progression = 1;
      timerReveler = null;
    }, DUREE_HOLD);
  }

  function arreterReveler(): void {
    if (timerReveler) {
      clearTimeout(timerReveler);
      timerReveler = null;
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    debutHold = null;
    progression = 0;
    partieStore.cacherMot();
  }

  function joueurSuivant(): void {
    if (!aRevele) return;
    aRevele = false;
    partieStore.joueurSuivantDistribution();
  }

  const labelRole: Record<string, { texte: string; couleur: string; badgeColor: string }> = {
    CIVIL: { texte: 'Civil', couleur: 'text-indigo-400', badgeColor: 'indigo' },
    UNDERCOVER: { texte: 'Undercover', couleur: 'text-orange-400', badgeColor: 'yellow' },
    MR_WHITE: { texte: 'Mr. White', couleur: 'text-white', badgeColor: 'gray' },
  };

  $: infoRole = joueur ? (labelRole[joueur.role] ?? labelRole['CIVIL']) : labelRole['CIVIL'];
  $: estDernier = indexCourant + 1 >= totalJoueurs;
  $: progressionPct = String(Math.round(progression * 100));
</script>

<div class="screen px-5 pt-14 pb-10 overflow-hidden">
  <div class="mb-6">
    <h1 class="text-4xl font-black leading-tight">
      C'est à <span class="text-indigo-400">{joueur?.nom}</span>…
    </h1>
    <p class="text-white/50 text-base mt-2">Ne laisse personne regarder.</p>
  </div>

  <!-- Zone de révélation (hold to reveal) -->
  <div
    class="flex-1 rounded-3xl flex flex-col items-center justify-center gap-5 px-6 py-10 cursor-pointer select-none relative overflow-hidden transition-colors duration-150"
    class:bg-zinc-800={!motVisible}
    class:bg-zinc-900={motVisible}
    on:pointerdown={commencerReveler}
    on:pointerup={arreterReveler}
    on:pointerleave={arreterReveler}
    on:pointercancel={arreterReveler}
    style="touch-action: none;"
    role="button"
    tabindex="0"
    aria-label="Maintenir pour révéler votre rôle"
    on:keydown={e => { if (e.key === ' ' || e.key === 'Enter') commencerReveler(); }}
    on:keyup={e => { if (e.key === ' ' || e.key === 'Enter') arreterReveler(); }}
  >
    {#if !motVisible}
      <div
        class="w-28 h-28 rounded-full bg-zinc-700/70 flex items-center justify-center transition-transform active:scale-95 relative"
        style="box-shadow: 0 0 0 8px rgba(249,115,22,0.12);"
      >
        {#if progression > 0}
          <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 112 112" aria-hidden="true">
            <circle
              cx="56" cy="56" r="52"
              fill="none"
              stroke="#f97316"
              stroke-width="4"
              stroke-dasharray={2 * Math.PI * 52}
              stroke-dashoffset={2 * Math.PI * 52 * (1 - progression)}
              stroke-linecap="round"
            />
          </svg>
        {/if}
        <svg class="relative z-10" width="52" height="52" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="1" y1="1" x2="23" y2="23" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="text-center">
        <p class="text-white text-2xl font-black">{progression > 0 ? 'Maintenez…' : 'Tap long pour révéler'}</p>
        <p class="text-white/40 text-sm mt-1">Relâche pour cacher</p>
      </div>

      {#if progression > 0}
        <div class="w-full px-6">
          <Progressbar
            progress={progressionPct}
            size="h-1"
            color="orange"
            classes={{ label: 'bg-orange-500' }}
            class="w-full"
          />
        </div>
      {/if}

    {:else}
      <div class="text-center flex flex-col items-center gap-4">
        <Badge color={infoRole.badgeColor} large class="uppercase! tracking-widest! text-sm!">
          {infoRole.texte}
        </Badge>

        {#if joueur?.role === 'MR_WHITE'}
          <p class="text-6xl font-black text-white">?</p>
          <p class="text-white/50 text-sm max-w-[200px] leading-relaxed text-center">
            Tu ne connais aucun mot. Bluff !
          </p>
        {:else}
          <p class="text-5xl font-black text-white tracking-tight leading-tight">
            {joueur?.mot}
          </p>
        {/if}
      </div>
    {/if}

    <!-- Indicateur de progression (points) -->
    <div class="absolute bottom-5 flex gap-1.5 items-center">
      {#each { length: totalJoueurs } as _, i}
        <div
          class="h-1.5 rounded-full transition-all duration-300 {i === indexCourant ? 'w-5 bg-orange-400' : 'w-3 bg-white/20'}"
        ></div>
      {/each}
    </div>
  </div>

  <div class="mt-5 flex flex-col items-center gap-3">
    <Button
      pill
      color={aRevele ? 'primary' : 'dark'}
      class="w-full! py-5! text-lg! font-bold!"
      disabled={!aRevele}
      onclick={joueurSuivant}
    >
      {#if !aRevele}
        <svg class="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      {/if}
      {estDernier ? 'Commencer la partie' : 'Joueur suivant'}
    </Button>

    {#if !aRevele}
      <p class="text-white/30 text-xs text-center">
        Maintenez la zone centrale pour voir votre identité
      </p>
    {/if}
  </div>
</div>
