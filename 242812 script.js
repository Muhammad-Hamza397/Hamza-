class LeaderboardManager {
    constructor() {
        this.currentGame = '';
        this.searchTerm = '';
        this.previousScores = new Map();
        this.players = [
            { id: 1, name: 'PUBG_Master', game: 'PUBG', score: 2800 },
            { id: 2, name: 'FF_Pro', game: 'Free Fire', score: 2500 },
            { id: 3, name: 'CraftKing', game: 'Minecraft', score: 1900 },
            { id: 4, name: 'PoolChamp', game: '8 Ball Pool', score: 2200 },
            { id: 5, name: 'SnakeEyes', game: '8 Ball Pool', score: 2100 },
            { id: 6, name: 'SurvivalPro', game: 'PUBG', score: 2600 },
            { id: 7, name: 'FireLegend', game: 'Free Fire', score: 2400 },
            { id: 8, name: 'BlockMaster', game: 'Minecraft', score: 1800 }
        ];
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        const gameSelect = document.getElementById('gameSelect');
        const playerSearch = document.getElementById('playerSearch');
        
        if (gameSelect) {
            gameSelect.addEventListener('change', (e) => {
                this.currentGame = e.target.value;
                this.updateLeaderboard();
            });
        }

        if (playerSearch) {
            playerSearch.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.updateLeaderboard();
            });
        }
    }

    getRandomScore(min = 1500, max = 3000) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    updateRandomScores() {
        this.players = this.players.map(player => ({
            ...player,
            score: this.getRandomScore()
        }));
    }

    filterPlayers() {
        return this.players.filter(player => 
            (this.currentGame === '' || player.game.toLowerCase() === this.currentGame.toLowerCase()) &&
            (this.searchTerm === '' || player.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
        );
    }

    addScoreUpdateAnimation(element, playerId, newScore) {
        const previousScore = this.previousScores.get(playerId);
        if (previousScore !== undefined && previousScore !== newScore) {
            element.classList.add('score-updated');
            element.addEventListener('animationend', () => {
                element.classList.remove('score-updated');
            }, { once: true });
        }
        this.previousScores.set(playerId, newScore);
    }

    updateLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');
        if (!leaderboardList) return;

        const filteredPlayers = this.filterPlayers();
        
        leaderboardList.innerHTML = '';
        
        filteredPlayers
            .sort((a, b) => b.score - a.score)
            .forEach((player, index) => {
                const row = document.createElement('div');
                row.className = 'player-row';
                row.innerHTML = `
                    <span class="rank">#${index + 1}</span>
                    <span class="player">${player.name}</span>
                    <span class="game">${player.game}</span>
                    <span class="score">${player.score.toLocaleString()}</span>
                `;
                
                const scoreElement = row.querySelector('.score');
                this.addScoreUpdateAnimation(scoreElement, player.id, player.score);
                
                leaderboardList.appendChild(row);
            });
    }

    startRealTimeUpdates() {
        if (document.getElementById('leaderboardList')) {
            this.updateLeaderboard();
            setInterval(() => {
                this.updateRandomScores();
                this.updateLeaderboard();
            }, 5000);
        }
    }
}

// Initialize the leaderboard only if we're on the main page
if (document.getElementById('leaderboardList')) {
    const leaderboard = new LeaderboardManager();
}