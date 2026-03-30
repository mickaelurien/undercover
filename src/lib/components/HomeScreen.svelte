<script lang="ts">
  import { Button, Card } from 'flowbite-svelte';
  import { partieStore, configStore } from '../stores/game';

  const NB_JOUEURS_MIN = 3;
  const NB_JOUEURS_MAX = 12;

  /**
   * Calcule le maximum d'undercovers autorisé selon le nombre de joueurs.
   * On réserve au moins 1 civil par undercover + 1 Mr. White éventuel.
   */
  $: nbUndercoverMax = Math.max(1, Math.floor(($configStore.nbJoueurs - $configStore.nbMrWhite) / 3));
  $: nbMrWhiteMax = Math.floor($configStore.nbJoueurs / 5);

  $: if ($configStore.nbUndercover > nbUndercoverMax) configStore.update(c => ({ ...c, nbUndercover: nbUndercoverMax }));
  $: if ($configStore.nbMrWhite > nbMrWhiteMax) configStore.update(c => ({ ...c, nbMrWhite: nbMrWhiteMax }));

  function changerJoueurs(delta: number): void {
    const val = Math.min(NB_JOUEURS_MAX, Math.max(NB_JOUEURS_MIN, $configStore.nbJoueurs + delta));
    configStore.update(c => ({ ...c, nbJoueurs: val }));
  }

  function changerUndercover(delta: number): void {
    const val = Math.min(nbUndercoverMax, Math.max(1, $configStore.nbUndercover + delta));
    configStore.update(c => ({ ...c, nbUndercover: val }));
  }

  function changerMrWhite(delta: number): void {
    const val = Math.min(nbMrWhiteMax, Math.max(0, $configStore.nbMrWhite + delta));
    configStore.update(c => ({ ...c, nbMrWhite: val }));
  }
</script>

<div class="screen justify-between px-5 pt-14 pb-10">
  <div class="flex flex-col gap-6 flex-1">
    <h1 class="text-5xl font-black text-center tracking-tight">Undercover</h1>

    <div class="flex flex-col gap-3 mt-4">
      <!-- Nombre de joueurs -->
      <Card class="bg-zinc-800/80! border-0! rounded-2xl! px-4 py-4! gap-0 flex-row items-center">
        <div class="w-12 h-12 rounded-xl bg-slate-700/80 flex items-center justify-center flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="9" cy="7" r="3" fill="#8b9cf8" opacity="0.9"/>
            <circle cx="15" cy="7" r="3" fill="#8b9cf8" opacity="0.6"/>
            <path d="M2 19c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="#8b9cf8" stroke-width="2" stroke-linecap="round" opacity="0.9"/>
            <path d="M16 13c2.21 0 4 1.567 4 3.5" stroke="#8b9cf8" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
          </svg>
        </div>

        <div class="flex-1 min-w-0 mx-4">
          <p class="text-white/50 text-xs font-medium uppercase tracking-wider">Nombre de Joueurs</p>
          <p class="text-white text-2xl font-black leading-none mt-0.5">{$configStore.nbJoueurs}</p>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <Button
            pill
            size="sm"
            color="dark"
            class="w-10! h-10! p-0! flex items-center justify-center text-xl font-bold"
            disabled={$configStore.nbJoueurs <= NB_JOUEURS_MIN}
            onclick={() => changerJoueurs(-1)}
            aria-label="Moins de joueurs"
          >−</Button>
          <Button
            pill
            size="sm"
            color="dark"
            class="w-10! h-10! p-0! flex items-center justify-center text-xl font-bold"
            disabled={$configStore.nbJoueurs >= NB_JOUEURS_MAX}
            onclick={() => changerJoueurs(1)}
            aria-label="Plus de joueurs"
          >+</Button>
        </div>
      </Card>

      <!-- Rôles spéciaux -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Undercover -->
        <Card class="bg-zinc-800/80! border-0! rounded-2xl! px-4! py-4! gap-3 flex flex-col">
          <div class="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
              <line x1="1" y1="1" x2="23" y2="23" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="text-orange-400 text-sm font-semibold">Undercover</span>
          </div>

          <p class="text-white text-3xl font-black leading-none">{$configStore.nbUndercover}</p>

          <div class="flex items-center gap-2">
            <Button
              pill
              size="sm"
              color="dark"
              class="w-9! h-9! p-0! flex items-center justify-center text-lg font-bold"
              disabled={$configStore.nbUndercover <= 1}
              onclick={() => changerUndercover(-1)}
              aria-label="Moins d'undercoverss"
            >−</Button>
            <Button
              pill
              size="sm"
              color="dark"
              class="w-9! h-9! p-0! flex items-center justify-center text-lg font-bold"
              disabled={$configStore.nbUndercover >= nbUndercoverMax}
              onclick={() => changerUndercover(1)}
              aria-label="Plus d'undercoverss"
            >+</Button>
          </div>
        </Card>

        <!-- Mr. White -->
        <Card class="bg-zinc-800/80! border-0! rounded-2xl! px-4! py-4! gap-3 flex flex-col">
          <div class="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" fill="white" opacity="0.8"/>
              <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
              <circle cx="18" cy="5" r="3" fill="#1a1a2e" stroke="white" stroke-width="1.5" opacity="0.8"/>
              <text x="15.5" y="8" font-size="5" fill="white" font-weight="bold">?</text>
            </svg>
            <span class="text-white/80 text-sm font-semibold">Mr. White</span>
          </div>

          <p class="text-white text-3xl font-black leading-none">{$configStore.nbMrWhite}</p>

          <div class="flex items-center gap-2">
            <Button
              pill
              size="sm"
              color="dark"
              class="w-9! h-9! p-0! flex items-center justify-center text-lg font-bold"
              disabled={$configStore.nbMrWhite <= 0}
              onclick={() => changerMrWhite(-1)}
              aria-label="Moins de Mr. White"
            >−</Button>
            <Button
              pill
              size="sm"
              color="dark"
              class="w-9! h-9! p-0! flex items-center justify-center text-lg font-bold"
              disabled={$configStore.nbMrWhite >= nbMrWhiteMax}
              onclick={() => changerMrWhite(1)}
              aria-label="Plus de Mr. White"
            >+</Button>
          </div>
        </Card>
      </div>
    </div>

    <div class="flex flex-col gap-3 mt-auto pt-4">
      <button class="btn-accent" on:click={() => partieStore.nouvellePartie()}>
        Nouvelle partie
      </button>
    </div>
  </div>

  <footer class="flex flex-col items-center gap-2 pt-4">
    <p class="text-white/20 text-[10px] uppercase tracking-widest">Version {__APP_VERSION__}</p>
  </footer>
</div>
