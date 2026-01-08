import { store } from '../store.js';

export function renderMatchScoring(matchId) {
  const state = store.getCurrentState();
  const tournament = state.currentTournament;
  const mode = state.currentMode;

  if (!tournament || !mode) {
    return '<div class="p-6 text-center">No match selected</div>';
  }

  const match = tournament.matches[mode].find(m => m.id === matchId);
  if (!match) {
    return '<div class="p-6 text-center">Match not found</div>';
  }

  const player1 = match.player1;
  const player2 = match.player2;
  const scores = match.scores;

  // Calculate current set based on completed sets, not array length
  let currentSet = 0;
  let player1Sets = 0;
  let player2Sets = 0;

  // Check each set to see if it's complete
  for (let i = 0; i < 3; i++) {
    const p1Score = scores.player1[i] || 0;
    const p2Score = scores.player2[i] || 0;

    let setComplete = false;
    if (p1Score >= 21 && p1Score - p2Score >= 2) {
      player1Sets++;
      setComplete = true;
    } else if (p2Score >= 21 && p2Score - p1Score >= 2) {
      player2Sets++;
      setComplete = true;
    } else if (p1Score >= 30 || p2Score >= 30) {
      if (p1Score > p2Score) {
        player1Sets++;
        setComplete = true;
      } else if (p2Score > p1Score) {
        player2Sets++;
        setComplete = true;
      }
    }

    // If set is complete, move to next set
    if (setComplete) {
      currentSet = i + 1;
    } else {
      // This is the current active set
      currentSet = i;
      break;
    }
  }

  return `
    <div class="min-h-screen p-6 fade-in">
      <!-- Header -->
      <div class="mb-8">
        <button id="back-to-bracket-btn" class="btn-primary mb-6 group relative z-10">
          <span class="inline-flex items-center gap-2 relative z-10">
            <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Bracket
          </span>
        </button>
        <div class="relative">
          <div class="absolute inset-0 flex items-center justify-center opacity-10">
            <div class="w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-3 gradient-text relative z-10">🏸 Match Scoring</h1>
          <p class="text-xl text-blue-200 relative z-10">${getModeName(mode)} - ${tournament.name}</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto">
        <!-- Match Info -->
        <div class="glass-card p-8 mb-8">
          <div class="text-center mb-6">
            <div class="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 mb-3">
              <h2 class="text-2xl font-bold">Match ${match.matchNumber}</h2>
            </div>
            <p class="text-lg text-blue-300 font-semibold">${getRoundName(match.round, getCurrentRounds())}</p>
          </div>

          <!-- Sets Score Display -->
          <div class="grid grid-cols-3 gap-6 mb-8">
            <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30">
              <div class="text-7xl font-bold text-blue-400 mb-2 text-glow">${player1Sets}</div>
              <div class="text-sm font-semibold text-blue-300 uppercase tracking-wide">Sets Won</div>
            </div>
            <div class="text-center flex items-center justify-center">
              <div class="text-5xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">VS</div>
            </div>
            <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30">
              <div class="text-7xl font-bold text-purple-400 mb-2 text-glow">${player2Sets}</div>
              <div class="text-sm font-semibold text-purple-300 uppercase tracking-wide">Sets Won</div>
            </div>
          </div>

          <!-- Current Set Scoring -->
          <div class="space-y-6">
            ${[0, 1, 2].map(setIndex => {
    const p1Score = scores.player1[setIndex] || 0;
    const p2Score = scores.player2[setIndex] || 0;
    const isCurrentSet = setIndex === currentSet;
    const isCompleted = setIndex < currentSet;

    return `
                <div class="card ${isCurrentSet ? 'border-2 border-yellow-400 shadow-2xl' : isCompleted ? 'opacity-75' : 'opacity-50'}">
                  <div class="flex items-center justify-center gap-3 mb-4">
                    <h3 class="text-2xl font-bold text-center">
                      Set ${setIndex + 1}
                    </h3>
                    ${isCurrentSet ? '<span class="px-3 py-1 rounded-full bg-yellow-400/30 text-yellow-200 text-sm font-bold animate-pulse">● LIVE</span>' : ''}
                    ${isCompleted ? '<span class="px-3 py-1 rounded-full bg-green-400/30 text-green-200 text-sm font-bold">✓ Done</span>' : ''}
                  </div>
                  
                  <!-- Player 1 -->
                  <div class="flex items-center justify-between mb-4 p-6 rounded-2xl bg-gradient-to-r from-blue-500/30 to-blue-600/20 border border-blue-400/30 hover:border-blue-400/50 transition-all">
                    <div class="flex-1">
                      <div class="text-2xl font-bold mb-2 text-blue-200">${player1?.name || 'Player 1'}</div>
                      <div class="text-6xl font-bold text-blue-400 text-glow">${p1Score}</div>
                    </div>
                    <div class="flex gap-3">
                      <button class="score-btn bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl disabled:opacity-30 disabled:cursor-not-allowed score-minus-btn" 
                              data-player="player1" data-set="${setIndex}"
                              ${!isCurrentSet || p1Score === 0 ? 'disabled' : ''}>
                        −
                      </button>
                      <button class="score-btn bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl disabled:opacity-30 disabled:cursor-not-allowed score-plus-btn" 
                              data-player="player1" data-set="${setIndex}"
                              ${!isCurrentSet ? 'disabled' : ''}>
                        +
                      </button>
                    </div>
                  </div>

                  <!-- Player 2 -->
                  <div class="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-purple-500/30 to-purple-600/20 border border-purple-400/30 hover:border-purple-400/50 transition-all">
                    <div class="flex-1">
                      <div class="text-2xl font-bold mb-2 text-purple-200">${player2?.name || 'Player 2'}</div>
                      <div class="text-6xl font-bold text-purple-400 text-glow">${p2Score}</div>
                    </div>
                    <div class="flex gap-3">
                      <button class="score-btn bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl disabled:opacity-30 disabled:cursor-not-allowed score-minus-btn" 
                              data-player="player2" data-set="${setIndex}"
                              ${!isCurrentSet || p2Score === 0 ? 'disabled' : ''}>
                        −
                      </button>
                      <button class="score-btn bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl disabled:opacity-30 disabled:cursor-not-allowed score-plus-btn" 
                              data-player="player2" data-set="${setIndex}"
                              ${!isCurrentSet ? 'disabled' : ''}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              `;
  }).join('')}
          </div>

          <!-- Match Status -->
          ${match.status === 'completed' ? `
            <div class="mt-8 p-6 rounded-xl bg-green-500/20 border-2 border-green-400 text-center">
              <div class="text-3xl font-bold mb-2">🏆 Match Complete!</div>
              <div class="text-2xl">Winner: ${match.winner.name}</div>
            </div>
          ` : ''}
        </div>

        <!-- Rules Info -->
        <div class="glass-card p-6">
          <h3 class="text-xl font-bold mb-4">📋 Badminton Rules</h3>
          <ul class="space-y-2 text-gray-300">
            <li>• First to 21 points wins a set</li>
            <li>• Must win by at least 2 points</li>
            <li>• Maximum 30 points per set (winner at 30)</li>
            <li>• Best of 3 sets wins the match</li>
          </ul>
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

function getRoundName(round, totalRounds) {
  if (round === totalRounds) return 'Final';
  if (round === totalRounds - 1) return 'Semi-Final';
  if (round === totalRounds - 2) return 'Quarter-Final';
  return `Round ${round}`;
}

function getCurrentRounds() {
  const state = store.getCurrentState();
  const tournament = state.currentTournament;
  const mode = state.currentMode;
  const bracket = tournament.brackets[mode];
  return bracket ? bracket.numRounds : 0;
}

export function attachMatchScoringListeners(matchId) {
  const state = store.getCurrentState();
  const tournament = state.currentTournament;
  const mode = state.currentMode;

  // Back button
  const backBtn = document.getElementById('back-to-bracket-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'mode-detail' } }));
    });
  }

  // Score buttons
  const plusBtns = document.querySelectorAll('.score-plus-btn');
  plusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const player = btn.dataset.player;
      const setIndex = parseInt(btn.dataset.set);
      const match = tournament.matches[mode].find(m => m.id === matchId);

      const currentScore = match.scores[player][setIndex] || 0;
      store.updateMatchScore(tournament.id, mode, matchId, player, setIndex, currentScore + 1);
    });
  });

  const minusBtns = document.querySelectorAll('.score-minus-btn');
  minusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const player = btn.dataset.player;
      const setIndex = parseInt(btn.dataset.set);
      const match = tournament.matches[mode].find(m => m.id === matchId);

      const currentScore = match.scores[player][setIndex] || 0;
      if (currentScore > 0) {
        store.updateMatchScore(tournament.id, mode, matchId, player, setIndex, currentScore - 1);
      }
    });
  });
}
