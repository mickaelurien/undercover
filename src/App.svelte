<script lang="ts">
  import { partieStore } from './lib/stores/game';
  import HomeScreen from './lib/components/HomeScreen.svelte';
  import GameSetup from './lib/components/GameSetup.svelte';
  import WordDistribution from './lib/components/WordDistribution.svelte';
  import VotingPhase from './lib/components/VotingPhase.svelte';
  import ResultScreen from './lib/components/ResultScreen.svelte';

  $: phase = $partieStore.phase;
</script>

<div class="h-full">
  {#if phase === 'ACCUEIL'}
    <HomeScreen />
  {:else if phase === 'CONFIGURATION'}
    <GameSetup />
  {:else if phase === 'DISTRIBUTION_MOTS'}
    <WordDistribution />
  {:else if phase === 'VOTE'}
    <VotingPhase />
  {:else if phase === 'RESULTAT'}
    <ResultScreen />
  {/if}
</div>
