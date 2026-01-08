import { store } from '../store.js';

export function renderTournamentDetail() {
    const state = store.getCurrentState();
    const tournament = state.currentTournament;

    if (!tournament) {
        return '<div class="p-6 text-center">No tournament selected</div>';
    }

    return `
    <div class="min-h-screen p-6 fade-in">
      <!-- Header -->
      <div class="mb-8">
        <button id="back-to-list-btn" class="btn-primary mb-6 group relative z-10">
          <span class="inline-flex items-center gap-2 relative z-10">
            <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Top
          </span>
        </button>
        <div class="relative">
          <div class="absolute inset-0 flex items-center justify-center opacity-10">
            <div class="w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold mb-3 gradient-text relative z-10">${tournament.name}</h1>
          <div class="flex items-center gap-3 text-xl text-blue-200 relative z-10">
            <span class="text-2xl">📅</span>
            <span>${new Date(tournament.startDate).toLocaleDateString()} - ${new Date(tournament.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <!-- Modes Selection -->
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold mb-6 text-glow flex items-center gap-3">
          <span class="text-4xl">🏆</span>
          Tournament Modes
        </h2>
        <div class="grid gap-4">
          ${tournament.modes.map((mode, index) => {
        const playerCount = tournament.participants[mode]?.length || 0;
        const hasDrawn = tournament.brackets[mode] !== null;
        const modeColors = {
          'MS': 'from-blue-500/30 to-blue-600/30 border-blue-400/50',
          'WS': 'from-pink-500/30 to-pink-600/30 border-pink-400/50',
          'MD': 'from-cyan-500/30 to-cyan-600/30 border-cyan-400/50',
          'WD': 'from-purple-500/30 to-purple-600/30 border-purple-400/50',
          'XD': 'from-violet-500/30 to-fuchsia-600/30 border-violet-400/50'
        };

        return `
              <div class="card tournament-item" style="animation-delay: ${index * 0.1}s">
                <div class="flex justify-between items-center">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="text-3xl">${getModeIcon(mode)}</div>
                      <h3 class="text-2xl md:text-3xl font-bold text-glow">${getModeName(mode)}</h3>
                    </div>
                    <div class="flex flex-wrap gap-3 text-gray-300">
                      <div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5">
                        <span class="text-xl">👥</span>
                        <span class="font-semibold">${playerCount} player${playerCount !== 1 ? 's' : ''}</span>
                      </div>
                      ${hasDrawn ? `
                        <div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/20 border border-green-400/30">
                          <span class="text-xl">✅</span>
                          <span class="font-semibold text-green-300">Draw completed</span>
                        </div>
                      ` : `
                        <div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-500/20 border border-yellow-400/30">
                          <span class="text-xl">⏳</span>
                          <span class="font-semibold text-yellow-300">Awaiting draw</span>
                        </div>
                      `}
                    </div>
                  </div>
                  <button class="mode-select-btn btn-secondary group" data-mode="${mode}">
                    <span class="inline-flex items-center gap-2">
                      Enter Mode
                      <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    </div>
  `;
}

function getModeName(mode) {
    const names = {
        'MS': "Men's Singles",
        'WS': "Women's Singles",
        'MD': "Men's Doubles",
        'WD': "Women's Doubles",
        'XD': "Mixed Doubles"
    };
    return names[mode] || mode;
}

function getModeIcon(mode) {
    const icons = {
        'MS': '👨',
        'WS': '👩',
        'MD': '👨‍👨‍👦',
        'WD': '👩‍👩‍👧',
        'XD': '👫'
    };
    return icons[mode] || '🏸';
}

export function attachTournamentDetailListeners() {
    // Back button
    const backBtn = document.getElementById('back-to-list-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'tournament-list' } }));
        });
    }

    // Mode selection
    const modeBtns = document.querySelectorAll('.mode-select-btn');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            store.setCurrentMode(mode);
            window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'mode-detail' } }));
        });
    });
}
