// Store for managing tournament state
class TournamentStore {
    constructor() {
        this.state = {
            tournaments: [],
            currentTournament: null,
            currentMode: null,
        };
        this.listeners = [];
        this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('badminton_tournaments');
            if (saved) {
                this.state = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('badminton_tournaments', JSON.stringify(this.state));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
        this.saveToStorage();
    }

    // Tournament Management
    createTournament(tournamentData) {
        const tournament = {
            id: Date.now().toString(),
            name: tournamentData.name,
            startDate: tournamentData.startDate,
            endDate: tournamentData.endDate,
            modes: tournamentData.modes || [], // MS, WS, MD, WD, XD
            participants: {},
            matches: {},
            brackets: {},
            status: 'created', // created, registration, drawn, in-progress, completed
            createdAt: new Date().toISOString(),
        };

        // Initialize each mode
        tournament.modes.forEach(mode => {
            tournament.participants[mode] = [];
            tournament.matches[mode] = [];
            tournament.brackets[mode] = null;
        });

        this.state.tournaments.push(tournament);
        this.notify();
        return tournament;
    }

    getTournaments() {
        return this.state.tournaments;
    }

    setCurrentTournament(tournamentId) {
        this.state.currentTournament = this.state.tournaments.find(t => t.id === tournamentId);
        this.state.currentMode = null;
        this.notify();
    }

    setCurrentMode(mode) {
        this.state.currentMode = mode;
        this.notify();
    }

    // Player Management
    addPlayer(tournamentId, mode, playerName) {
        const tournament = this.state.tournaments.find(t => t.id === tournamentId);
        if (!tournament) return;

        const player = {
            id: Date.now().toString() + Math.random(),
            name: playerName,
            mode: mode,
        };

        tournament.participants[mode].push(player);
        this.notify();
    }

    removePlayer(tournamentId, mode, playerId) {
        const tournament = this.state.tournaments.find(t => t.id === tournamentId);
        if (!tournament) return;

        tournament.participants[mode] = tournament.participants[mode].filter(p => p.id !== playerId);
        this.notify();
    }

    // Draw/Bracket Generation
    generateDraw(tournamentId, mode) {
        const tournament = this.state.tournaments.find(t => t.id === tournamentId);
        if (!tournament) return;

        const players = [...tournament.participants[mode]];

        // Shuffle players
        for (let i = players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [players[i], players[j]] = [players[j], players[i]];
        }

        // Generate single elimination bracket
        const bracket = this.createBracket(players);
        tournament.brackets[mode] = bracket;
        tournament.matches[mode] = this.generateMatchesFromBracket(bracket);

        this.notify();
    }

    createBracket(players) {
        // Determine the next power of 2
        const numPlayers = players.length;
        const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(numPlayers)));

        // Create bracket structure
        const rounds = Math.log2(nextPowerOf2);
        const bracket = {
            rounds: [],
            numRounds: rounds,
        };

        // First round
        const firstRoundMatches = [];
        let playerIndex = 0;

        for (let i = 0; i < nextPowerOf2 / 2; i++) {
            const player1 = players[playerIndex++] || null;
            const player2 = players[playerIndex++] || null;

            firstRoundMatches.push({
                id: `r1-m${i}`,
                round: 1,
                matchNumber: i + 1,
                player1: player1,
                player2: player2,
                winner: (!player2 && player1) ? player1 : null, // Bye
                scores: { player1: [], player2: [] },
                status: (!player2 && player1) ? 'completed' : 'pending',
            });
        }

        bracket.rounds.push(firstRoundMatches);

        // Subsequent rounds
        for (let round = 2; round <= rounds; round++) {
            const roundMatches = [];
            const prevRoundMatches = bracket.rounds[round - 2];

            for (let i = 0; i < prevRoundMatches.length / 2; i++) {
                roundMatches.push({
                    id: `r${round}-m${i}`,
                    round: round,
                    matchNumber: i + 1,
                    player1: null,
                    player2: null,
                    winner: null,
                    scores: { player1: [], player2: [] },
                    status: 'pending',
                    feedsFrom: [prevRoundMatches[i * 2].id, prevRoundMatches[i * 2 + 1].id],
                });
            }

            bracket.rounds.push(roundMatches);
        }

        return bracket;
    }

    generateMatchesFromBracket(bracket) {
        const matches = [];
        bracket.rounds.forEach(round => {
            round.forEach(match => {
                matches.push(match);
            });
        });
        return matches;
    }

    // Scoring
    updateMatchScore(tournamentId, mode, matchId, player, setIndex, score) {
        const tournament = this.state.tournaments.find(t => t.id === tournamentId);
        if (!tournament) return;

        const match = tournament.matches[mode].find(m => m.id === matchId);
        if (!match) return;

        // Update score
        if (player === 'player1') {
            match.scores.player1[setIndex] = score;
        } else {
            match.scores.player2[setIndex] = score;
        }
        
        // Also update the match in bracket.rounds to keep them in sync
        const bracket = tournament.brackets[mode];
        if (bracket) {
            bracket.rounds.forEach(round => {
                const bracketMatch = round.find(m => m.id === matchId);
                if (bracketMatch) {
                    if (player === 'player1') {
                        bracketMatch.scores.player1[setIndex] = score;
                    } else {
                        bracketMatch.scores.player2[setIndex] = score;
                    }
                }
            });
        }

        this.checkMatchCompletion(match);
        this.notify();
    }

    checkMatchCompletion(match) {
        const scores = match.scores;
        let player1Sets = 0;
        let player2Sets = 0;

        // Count sets won (best of 3, first to 21 points)
        for (let i = 0; i < Math.max(scores.player1.length, scores.player2.length); i++) {
            const p1Score = scores.player1[i] || 0;
            const p2Score = scores.player2[i] || 0;

            if (p1Score >= 21 && p1Score - p2Score >= 2) {
                player1Sets++;
            } else if (p2Score >= 21 && p2Score - p1Score >= 2) {
                player2Sets++;
            } else if (p1Score >= 30 || p2Score >= 30) {
                // Max score rule
                if (p1Score > p2Score) player1Sets++;
                else if (p2Score > p1Score) player2Sets++;
            }
        }

        // Check if match is won (2 out of 3 sets)
        if (player1Sets >= 2) {
            match.winner = match.player1;
            match.status = 'completed';
            
            // Update in bracket rounds as well
            const tournament = this.state.currentTournament;
            const mode = this.state.currentMode;
            const bracket = tournament.brackets[mode];
            if (bracket) {
                bracket.rounds.forEach(round => {
                    const bracketMatch = round.find(m => m.id === match.id);
                    if (bracketMatch) {
                        bracketMatch.winner = match.winner;
                        bracketMatch.status = 'completed';
                    }
                });
            }
            
            this.propagateWinner(match);
        } else if (player2Sets >= 2) {
            match.winner = match.player2;
            match.status = 'completed';
            
            // Update in bracket rounds as well
            const tournament = this.state.currentTournament;
            const mode = this.state.currentMode;
            const bracket = tournament.brackets[mode];
            if (bracket) {
                bracket.rounds.forEach(round => {
                    const bracketMatch = round.find(m => m.id === match.id);
                    if (bracketMatch) {
                        bracketMatch.winner = match.winner;
                        bracketMatch.status = 'completed';
                    }
                });
            }
            
            this.propagateWinner(match);
        }
    }

    propagateWinner(match) {
        if (!match.winner) return;

        const tournament = this.state.currentTournament;
        const mode = this.state.currentMode;
        const bracket = tournament.brackets[mode];
        const matches = tournament.matches[mode];

        // Find next match in bracket rounds
        bracket.rounds.forEach(round => {
            round.forEach(nextMatch => {
                if (nextMatch.feedsFrom && nextMatch.feedsFrom.includes(match.id)) {
                    const feedIndex = nextMatch.feedsFrom.indexOf(match.id);
                    if (feedIndex === 0) {
                        nextMatch.player1 = match.winner;
                    } else {
                        nextMatch.player2 = match.winner;
                    }
                    
                    // Also update in the matches array
                    const matchInArray = matches.find(m => m.id === nextMatch.id);
                    if (matchInArray) {
                        if (feedIndex === 0) {
                            matchInArray.player1 = match.winner;
                        } else {
                            matchInArray.player2 = match.winner;
                        }
                    }
                }
            });
        });
    }

    getCurrentState() {
        return this.state;
    }

    exportData() {
        return JSON.stringify(this.state, null, 2);
    }

    importData(jsonString) {
        try {
            this.state = JSON.parse(jsonString);
            this.notify();
        } catch (error) {
            console.error('Error importing data:', error);
        }
    }

    reset() {
        this.state = {
            tournaments: [],
            currentTournament: null,
            currentMode: null,
        };
        this.notify();
    }
}

export const store = new TournamentStore();
