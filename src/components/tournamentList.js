import { store } from '../store.js';

export function renderTournamentList() {
    const tournaments = store.getTournaments();

    return `
    <div class="min-h-screen p-6 fade-in">
      <!-- Header with animated gradient -->
      <div class="text-center mb-12 relative">
        <div class="absolute inset-0 flex items-center justify-center opacity-20">
          <div class="w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
        </div>
        <h1 class="text-6xl md:text-7xl font-bold mb-4 gradient-text relative z-10">🏸 Badminton Tournament Manager</h1>
        <p class="text-xl text-blue-200 relative z-10">Manage your badminton tournaments with ease</p>
      </div>

      <!-- Create New Tournament Button -->
      <div class="max-w-4xl mx-auto mb-8">
        <button id="create-tournament-btn" class="btn-primary w-full text-lg py-4 pulse-glow">
          ✨ Create New Tournament
        </button>
      </div>

      <!-- Tournament List -->
      <div class="max-w-4xl mx-auto grid gap-6">
        ${tournaments.length === 0 ? `
          <div class="glass-card p-12 text-center fade-in">
            <div class="text-8xl mb-6 animate-bounce">🎯</div>
            <h2 class="text-3xl font-semibold mb-3 gradient-text">No Tournaments Yet</h2>
            <p class="text-lg text-gray-300">Create your first tournament to get started!</p>
          </div>
        ` : tournaments.map((tournament, index) => `
          <div class="card cursor-pointer tournament-item relative group" 
               data-tournament-id="${tournament.id}"
               style="animation-delay: ${index * 0.1}s">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div class="flex justify-between items-start relative z-10">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <h2 class="text-2xl md:text-3xl font-bold text-glow">${tournament.name}</h2>
                  ${tournament.status === 'in-progress' ? '<span class="text-2xl animate-pulse">🔥</span>' : ''}
                  ${tournament.status === 'completed' ? '<span class="text-2xl">✅</span>' : ''}
                </div>
                <div class="flex items-center gap-2 text-gray-300 mb-4">
                  <span class="text-lg">📅</span>
                  <span class="text-base">${new Date(tournament.startDate).toLocaleDateString()} - ${new Date(tournament.endDate).toLocaleDateString()}</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  ${tournament.modes.map(mode => `
                    <span class="px-4 py-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 
                                 rounded-full text-sm font-semibold backdrop-blur-sm 
                                 border border-blue-400/30 hover:border-blue-400/60 
                                 transition-all duration-300 hover:scale-110 cursor-pointer
                                 mode-badge"
                          data-tournament-id="${tournament.id}"
                          data-mode="${mode}">${mode}</span>
                  `).join('')}
                </div>
              </div>
              <div class="text-right flex flex-col gap-3 items-end">
                <span class="px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm
                  ${tournament.status === 'completed' 
                    ? 'bg-gradient-to-r from-green-500/40 to-emerald-500/40 text-green-200 border border-green-400/50' :
                    tournament.status === 'in-progress' 
                    ? 'bg-gradient-to-r from-yellow-500/40 to-orange-500/40 text-yellow-200 border border-yellow-400/50 animate-pulse' :
                    'bg-gradient-to-r from-gray-500/40 to-slate-500/40 text-gray-200 border border-gray-400/50'}">
                  ${tournament.status === 'completed' ? '✓ Completed' : 
                    tournament.status === 'in-progress' ? '● In Progress' : 
                    '○ Upcoming'}
                </span>
                <div class="text-blue-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to view →
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Create Tournament Modal (Hidden by default) -->
      <div id="create-modal" class="hidden fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <div class="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto fade-in">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold gradient-text">✨ Create New Tournament</h2>
            <button id="cancel-create-btn" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form id="create-tournament-form" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold mb-2 text-blue-200">Tournament Name</label>
              <input type="text" name="name" required
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
                       focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                       transition-all hover:bg-white/15"
                placeholder="e.g., City Championship 2026">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-2 text-blue-200">Start Date</label>
                <input type="date" name="startDate" required
                  class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
                         focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                         transition-all hover:bg-white/15">
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-blue-200">End Date</label>
                <input type="date" name="endDate" required
                  class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
                         focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                         transition-all hover:bg-white/15">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-semibold mb-3 text-blue-200">Tournament Modes</label>
              <div class="grid grid-cols-2 gap-3">
                <label class="flex items-center space-x-3 cursor-pointer p-4 rounded-xl 
                              bg-white/5 hover:bg-white/15 border border-white/10 
                              hover:border-blue-400/50 transition-all group">
                  <input type="checkbox" name="modes" value="MS" 
                         class="w-5 h-5 rounded border-2 border-blue-400 text-blue-500 
                                focus:ring-2 focus:ring-blue-500/50">
                  <span class="group-hover:text-blue-300 transition-colors">👨 Men's Singles (MS)</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer p-4 rounded-xl 
                              bg-white/5 hover:bg-white/15 border border-white/10 
                              hover:border-pink-400/50 transition-all group">
                  <input type="checkbox" name="modes" value="WS" 
                         class="w-5 h-5 rounded border-2 border-pink-400 text-pink-500 
                                focus:ring-2 focus:ring-pink-500/50">
                  <span class="group-hover:text-pink-300 transition-colors">👩 Women's Singles (WS)</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer p-4 rounded-xl 
                              bg-white/5 hover:bg-white/15 border border-white/10 
                              hover:border-blue-400/50 transition-all group">
                  <input type="checkbox" name="modes" value="MD" 
                         class="w-5 h-5 rounded border-2 border-blue-400 text-blue-500 
                                focus:ring-2 focus:ring-blue-500/50">
                  <span class="group-hover:text-blue-300 transition-colors">👨‍👨‍👦 Men's Doubles (MD)</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer p-4 rounded-xl 
                              bg-white/5 hover:bg-white/15 border border-white/10 
                              hover:border-pink-400/50 transition-all group">
                  <input type="checkbox" name="modes" value="WD" 
                         class="w-5 h-5 rounded border-2 border-pink-400 text-pink-500 
                                focus:ring-2 focus:ring-pink-500/50">
                  <span class="group-hover:text-pink-300 transition-colors">👩‍👩‍👧 Women's Doubles (WD)</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer p-4 rounded-xl 
                              bg-white/5 hover:bg-white/15 border border-white/10 
                              hover:border-purple-400/50 transition-all group col-span-2">
                  <input type="checkbox" name="modes" value="XD" 
                         class="w-5 h-5 rounded border-2 border-purple-400 text-purple-500 
                                focus:ring-2 focus:ring-purple-500/50">
                  <span class="group-hover:text-purple-300 transition-colors">👫 Mixed Doubles (XD)</span>
                </label>
              </div>
            </div>
            
            <div class="flex gap-4 pt-4">
              <button type="button" id="cancel-create-btn-bottom" class="flex-1 btn-danger">
                ✕ Cancel
              </button>
              <button type="submit" class="flex-1 btn-secondary">
                ✨ Create Tournament
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function attachTournamentListListeners() {
    // Open modal
    const createBtn = document.getElementById('create-tournament-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            document.getElementById('create-modal').classList.remove('hidden');
        });
    }

    // Close modal - top X button
    const cancelBtn = document.getElementById('cancel-create-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('create-modal').classList.add('hidden');
        });
    }
    
    // Close modal - bottom cancel button
    const cancelBtnBottom = document.getElementById('cancel-create-btn-bottom');
    if (cancelBtnBottom) {
        cancelBtnBottom.addEventListener('click', () => {
            document.getElementById('create-modal').classList.add('hidden');
        });
    }
    
    // Close modal on backdrop click
    const modal = document.getElementById('create-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // Submit form
    const form = document.getElementById('create-tournament-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            const modes = formData.getAll('modes');
            if (modes.length === 0) {
                alert('Please select at least one tournament mode');
                return;
            }

            const tournamentData = {
                name: formData.get('name'),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate'),
                modes: modes,
            };

            store.createTournament(tournamentData);
            document.getElementById('create-modal').classList.add('hidden');
            e.target.reset();
        });
    }

    // Mode badge click - direct to mode detail (must be before tournament click to work properly)
    const modeBadges = document.querySelectorAll('.mode-badge');
    modeBadges.forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent tournament item click
            const tournamentId = badge.dataset.tournamentId;
            const mode = badge.dataset.mode;
            store.setCurrentTournament(tournamentId);
            store.setCurrentMode(mode);
            window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'mode-detail' } }));
        });
    });

    // Tournament selection
    const tournamentItems = document.querySelectorAll('.tournament-item');
    tournamentItems.forEach(item => {
        item.addEventListener('click', () => {
            const tournamentId = item.dataset.tournamentId;
            store.setCurrentTournament(tournamentId);
            window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'tournament-detail' } }));
        });
    });
}
