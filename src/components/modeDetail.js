import { store } from '../store.js';

export function renderModeDetail() {
    const state = store.getCurrentState();
    const tournament = state.currentTournament;
    const mode = state.currentMode;

    if (!tournament || !mode) {
        return '<div class="p-6 text-center">No mode selected</div>';
    }

    const players = tournament.participants[mode] || [];
    const hasDrawn = tournament.brackets[mode] !== null;
    const bracket = tournament.brackets[mode];
    const matches = tournament.matches[mode] || [];

    return `
    <div class="min-h-screen p-6">
      <!-- Header -->
      <div class="mb-8">
        <button id="back-to-tournament-btn" class="btn-primary mb-4 relative z-10">
          <span class="relative z-10">← Back to Tournament</span>
        </button>
        <h1 class="text-5xl font-bold mb-2 gradient-text">${getModeName(mode)}</h1>
        <p class="text-xl text-blue-200">${tournament.name}</p>
      </div>

      <div class="max-w-6xl mx-auto">
        ${!hasDrawn ? `
          <!-- Player Management -->
          <div class="mb-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-3xl font-bold text-glow">Player Registration</h2>
              <button id="add-player-btn" class="btn-secondary">
                ➕ Add Player
              </button>
            </div>

            <div class="grid gap-4 mb-8">
              ${players.length === 0 ? `
                <div class="glass-card p-12 text-center">
                  <div class="text-6xl mb-4">👥</div>
                  <h3 class="text-2xl font-semibold mb-2">No Players Yet</h3>
                  <p class="text-gray-300">Add players to start the tournament</p>
                </div>
              ` : players.map((player, index) => `
                <div class="card flex justify-between items-center">
                  <div class="flex items-center space-x-4">
                    <span class="text-2xl font-bold text-blue-400">#${index + 1}</span>
                    <span class="text-xl">${player.name}</span>
                  </div>
                  <button class="remove-player-btn btn-danger py-2 px-4 text-sm" data-player-id="${player.id}">
                    🗑️ Remove
                  </button>
                </div>
              `).join('')}
            </div>

            ${players.length >= 2 ? `
              <button id="generate-draw-btn" class="btn-secondary w-full text-lg py-4">
                🎲 Generate Draw & Create Bracket
              </button>
            ` : `
              <div class="glass-card p-6 text-center">
                <p class="text-gray-300">Add at least 2 players to generate the draw</p>
              </div>
            `}
          </div>

          <!-- Add Player Modal -->
          <div id="add-player-modal" class="hidden fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div class="glass-card p-8 max-w-md w-full">
              <h2 class="text-3xl font-bold mb-6 gradient-text">Add Player</h2>
              
              <form id="add-player-form" class="space-y-6">
                <div>
                  <label class="block text-sm font-semibold mb-2">Player Name</label>
                  <input type="text" name="playerName" required
                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="Enter player name">
                </div>
                
                <div class="flex gap-4">
                  <button type="button" id="cancel-add-player-btn" class="flex-1 btn-danger">
                    Cancel
                  </button>
                  <button type="submit" class="flex-1 btn-secondary">
                    ✅ Add Player
                  </button>
                </div>
              </form>
            </div>
          </div>
        ` : `
          <!-- Bracket View -->
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-glow mb-6">Tournament Bracket</h2>
            
            <div class="overflow-x-auto pb-8">
              <div class="inline-flex gap-8 min-w-full">
                ${bracket.rounds.map((round, roundIndex) => `
                  <div class="flex flex-col gap-4 min-w-[280px]">
                    <h3 class="text-xl font-bold text-center mb-4 text-blue-300">
                      ${getRoundName(roundIndex + 1, bracket.numRounds)}
                    </h3>
                    ${round.map(match => `
                      <div class="card ${match.player1 && match.player2 ? 'cursor-pointer hover:scale-105 border-2' : ''} 
                           ${match.status === 'pending' ? 'border-green-500/50' : 'border-blue-500/50'}
                           match-item" 
                           data-match-id="${match.id}"
                           ${match.player1 && match.player2 ? 'data-clickable="true"' : ''}>
                        <div class="text-sm text-gray-400 mb-2">Match ${match.matchNumber}</div>
                        
                        <div class="space-y-2">
                          <div class="flex justify-between items-center p-2 rounded ${match.winner?.id === match.player1?.id ? 'bg-green-500/20' : 'bg-white/5'}">
                            <span class="font-semibold">${match.player1?.name || 'TBD'}</span>
                            <span class="text-sm">${formatScore(match.scores?.player1)}</span>
                          </div>
                          
                          <div class="flex justify-between items-center p-2 rounded ${match.winner?.id === match.player2?.id ? 'bg-green-500/20' : 'bg-white/5'}">
                            <span class="font-semibold">${match.player2?.name || 'TBD'}</span>
                            <span class="text-sm">${formatScore(match.scores?.player2)}</span>
                          </div>
                        </div>
                        
                        ${match.status === 'completed' ? `
                          <div class="mt-2 text-center text-sm text-green-400">
                            ✅ Winner: ${match.winner?.name} • Click to view
                          </div>
                        ` : match.player1 && match.player2 ? `
                          <div class="mt-2 text-center text-sm text-yellow-400">
                            ⏳ Click to enter score
                          </div>
                        ` : ''}
                      </div>
                    `).join('')}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `}
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

function getRoundName(round, totalRounds) {
    if (round === totalRounds) return 'Final';
    if (round === totalRounds - 1) return 'Semi-Final';
    if (round === totalRounds - 2) return 'Quarter-Final';
    return `Round ${round}`;
}

function formatScore(scores) {
    if (!scores || scores.length === 0) return '-';
    // Filter out undefined, null, or empty values
    const validScores = scores.filter(score => score !== undefined && score !== null && score !== '');
    if (validScores.length === 0) return '-';
    return validScores.join(', ');
}

export function attachModeDetailListeners() {
    const state = store.getCurrentState();
    const tournament = state.currentTournament;
    const mode = state.currentMode;

    // Back button
    const backBtn = document.getElementById('back-to-tournament-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'tournament-detail' } }));
        });
    }

    // Add player modal
    const addPlayerBtn = document.getElementById('add-player-btn');
    if (addPlayerBtn) {
        addPlayerBtn.addEventListener('click', () => {
            document.getElementById('add-player-modal').classList.remove('hidden');
        });
    }

    const cancelAddPlayerBtn = document.getElementById('cancel-add-player-btn');
    if (cancelAddPlayerBtn) {
        cancelAddPlayerBtn.addEventListener('click', () => {
            document.getElementById('add-player-modal').classList.add('hidden');
        });
    }

    // Add player form
    const addPlayerForm = document.getElementById('add-player-form');
    if (addPlayerForm) {
        addPlayerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const playerName = formData.get('playerName');

            store.addPlayer(tournament.id, mode, playerName);
            document.getElementById('add-player-modal').classList.add('hidden');
            e.target.reset();
        });
    }

    // Remove player
    const removePlayerBtns = document.querySelectorAll('.remove-player-btn');
    removePlayerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const playerId = btn.dataset.playerId;
            if (confirm('Are you sure you want to remove this player?')) {
                store.removePlayer(tournament.id, mode, playerId);
            }
        });
    });

    // Generate draw
    const generateDrawBtn = document.getElementById('generate-draw-btn');
    if (generateDrawBtn) {
        generateDrawBtn.addEventListener('click', () => {
            if (confirm('Generate the tournament bracket? This cannot be undone.')) {
                store.generateDraw(tournament.id, mode);
            }
        });
    }

    // Match click for scoring
    const matchItems = document.querySelectorAll('.match-item[data-clickable="true"]');
    matchItems.forEach(item => {
        item.addEventListener('click', () => {
            const matchId = item.dataset.matchId;
            window.dispatchEvent(new CustomEvent('navigate', {
                detail: { view: 'match-scoring', matchId: matchId }
            }));
        });
    });
}
