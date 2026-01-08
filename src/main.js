import './style.css';
import { store } from './store.js';
import { renderTournamentList, attachTournamentListListeners } from './components/tournamentList.js';
import { renderTournamentDetail, attachTournamentDetailListeners } from './components/tournamentDetail.js';
import { renderModeDetail, attachModeDetailListeners } from './components/modeDetail.js';
import { renderMatchScoring, attachMatchScoringListeners } from './components/matchScoring.js';

// Router state
let currentView = 'tournament-list';
let currentMatchId = null;

// Router function
function navigate(view, data = {}) {
  currentView = view;
  if (data.matchId) {
    currentMatchId = data.matchId;
  }
  render();
}

// Render function
function render() {
  const app = document.getElementById('app');

  let html = '';

  switch (currentView) {
    case 'tournament-list':
      html = renderTournamentList();
      break;
    case 'tournament-detail':
      html = renderTournamentDetail();
      break;
    case 'mode-detail':
      html = renderModeDetail();
      break;
    case 'match-scoring':
      html = renderMatchScoring(currentMatchId);
      break;
    default:
      html = renderTournamentList();
  }

  app.innerHTML = html;

  // Attach listeners based on current view
  switch (currentView) {
    case 'tournament-list':
      attachTournamentListListeners();
      break;
    case 'tournament-detail':
      attachTournamentDetailListeners();
      break;
    case 'mode-detail':
      attachModeDetailListeners();
      break;
    case 'match-scoring':
      attachMatchScoringListeners(currentMatchId);
      break;
  }
}

// Listen to store changes
store.subscribe((state) => {
  render();
});

// Listen to navigation events
window.addEventListener('navigate', (e) => {
  navigate(e.detail.view, e.detail);
});

// Initial render
render();

