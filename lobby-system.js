// ============================================
// LOBBY SYSTEM - Main Menu & Player Stats
// ============================================

class LobbySystem {
    constructor() {
        this.playerStats = {
            totalRuns: 0,
            bestFloor: 1,
            totalGold: 0,
            totalEnemiesDefeated: 0,
            bestRunTime: 0,
            deathCount: 0
        };
        
        this.selectedDifficulty = 'normal';
        this.loadStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('playBtn').addEventListener('click', () => this.startGame());
        document.getElementById('statsBtn').addEventListener('click', () => this.showStats());

        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectDifficulty(btn));
        });
    }

    selectDifficulty(btn) {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedDifficulty = btn.dataset.difficulty;
    }

    startGame() {
        document.getElementById('lobbyScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'flex';
        
        // Initialize game with selected difficulty
        if (window.initializeGame) {
            window.initializeGame(this.selectedDifficulty);
        }
    }

    showStats() {
        alert(`=== YOUR STATISTICS ===
        
Total Runs: ${this.playerStats.totalRuns}
Best Floor Reached: ${this.playerStats.bestFloor}
Total Gold Earned: ${this.playerStats.totalGold}
Enemies Defeated: ${this.playerStats.totalEnemiesDefeated}
Deaths: ${this.playerStats.deathCount}
        `);
    }

    loadStats() {
        const saved = localStorage.getItem('dungeon_stats');
        if (saved) {
            this.playerStats = JSON.parse(saved);
            this.updateStatsDisplay();
        }
    }

    saveStats() {
        localStorage.setItem('dungeon_stats', JSON.stringify(this.playerStats));
    }

    updateStatsDisplay() {
        document.getElementById('totalRuns').textContent = this.playerStats.totalRuns;
        document.getElementById('bestFloor').textContent = this.playerStats.bestFloor;
        document.getElementById('totalGold').textContent = this.playerStats.totalGold;
        document.getElementById('totalEnemies').textContent = this.playerStats.totalEnemiesDefeated;
    }

    recordRunCompletion(floor, goldEarned, enemiesDefeated) {
        this.playerStats.totalRuns++;
        this.playerStats.bestFloor = Math.max(this.playerStats.bestFloor, floor);
        this.playerStats.totalGold += goldEarned;
        this.playerStats.totalEnemiesDefeated += enemiesDefeated;
        this.saveStats();
        this.updateStatsDisplay();
    }

    recordDeath() {
        this.playerStats.deathCount++;
        this.saveStats();
    }
}

// Create global lobby system
const lobbySystem = new LobbySystem();

// Function to return to lobby
function returnToLobby() {
    location.reload();
}
