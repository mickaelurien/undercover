<script lang="ts">
  import { partieStore } from '../stores/game';

  let afficherRegles = false;
</script>

<div class="screen items-center justify-between px-6 py-12">
  <div class="flex flex-col items-center gap-4 mt-8">
    <div class="text-7xl mb-2">🕵️</div>
    <h1 class="text-4xl font-black tracking-tight text-white">Undercover</h1>
    <p class="text-white/50 text-center text-sm leading-relaxed max-w-xs">
      Trouvez l'imposteur avant qu'il ne soit trop tard
    </p>
  </div>

  <div class="flex flex-col gap-4 w-full max-w-sm">
    <button class="btn-primary" on:click={() => partieStore.nouvellePartie()}>
      Nouvelle partie
    </button>
    <button class="btn-secondary" on:click={() => (afficherRegles = true)}>
      Règles du jeu
    </button>
  </div>
</div>

{#if afficherRegles}
  <div
    class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end"
    on:click|self={() => (afficherRegles = false)}
    on:keydown={e => e.key === 'Escape' && (afficherRegles = false)}
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label="Règles du jeu"
  >
    <div class="bg-gray-900 rounded-t-3xl w-full p-6 pb-10 max-h-[85vh] overflow-y-auto">
      <div class="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6"></div>
      <h2 class="text-2xl font-bold mb-5">Règles du jeu</h2>

      <div class="space-y-5 text-white/80 text-sm leading-relaxed">
        <div class="card">
          <h3 class="font-bold text-white mb-2">🎭 Les rôles</h3>
          <p>La majorité des joueurs sont des <strong class="text-primary-400">Civils</strong> — ils partagent le même mot. Un joueur est l'<strong class="text-red-400">Undercover</strong> — il a un mot similaire mais différent.</p>
        </div>

        <div class="card">
          <h3 class="font-bold text-white mb-2">📱 Distribution des mots</h3>
          <p>Chaque joueur consulte son mot en secret sur le téléphone. Personne ne sait qui est l'undercover.</p>
        </div>

        <div class="card">
          <h3 class="font-bold text-white mb-2">💬 Phase d'indices</h3>
          <p>Tour à tour, chaque joueur donne un mot indice. Soyez assez vague pour ne pas trahir votre mot, mais assez précis pour convaincre que vous êtes civil.</p>
        </div>

        <div class="card">
          <h3 class="font-bold text-white mb-2">🗳️ Vote</h3>
          <p>Les joueurs votent pour éliminer celui qu'ils soupçonnent d'être l'undercover.</p>
        </div>

        <div class="card">
          <h3 class="font-bold text-white mb-2">🏆 Victoire</h3>
          <ul class="space-y-1 list-disc list-inside">
            <li><strong class="text-green-400">Civils gagnent</strong> si l'undercover est éliminé</li>
            <li><strong class="text-red-400">Undercover gagne</strong> si un civil est éliminé</li>
          </ul>
        </div>
      </div>

      <button class="btn-primary mt-6" on:click={() => (afficherRegles = false)}>
        Compris !
      </button>
    </div>
  </div>
{/if}
