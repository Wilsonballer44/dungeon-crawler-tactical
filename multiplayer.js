// ============================================
// MULTIPLAYER MANAGER - Network Communication
// ============================================

class MultiplayerManager {
    constructor() {
        this.isOnline = false;
        this.playerId = null;
        this.playerName = 'Player_' + Math.floor(Math.random() * 10000);
        this.currentRoom = null;
        this.partyMembers = [];
        this.serverUrl = 'http://localhost:3000';
        this.messageQueue = [];
    }

    async initialize() {
        try {
            const response = await fetch(`${this.serverUrl}/api/connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerName: this.playerName })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.playerId = data.playerId;
                this.isOnline = true;
                this.startHeartbeat();
                console.log('✅ Connected to server');
                return true;
            }
        } catch (err) {
            console.log('⚠️ Server offline - running in offline mode');
            this.isOnline = false;
            this.playerId = 'offline_' + Math.random();
        }
        return false;
    }

    startHeartbeat() {
        setInterval(() => {
            if (this.isOnline && this.playerId) {
                this.sendHeartbeat();
            }
        }, 5000);
    }

    async sendHeartbeat() {
        try {
            await fetch(`${this.serverUrl}/api/heartbeat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: this.playerId })
            });
        } catch (err) {
            // Silent fail
        }
    }

    async createRoom(difficulty, maxPlayers = 4) {
        if (!this.isOnline) return null;
        
        try {
            const response = await fetch(`${this.serverUrl}/api/sessions/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: this.playerId,
                    difficulty: difficulty,
                    maxPlayers: maxPlayers
                })
            });
            
            const data = await response.json();
            this.currentRoom = data.id;
            this.partyMembers = data.players;
            return data;
        } catch (err) {
            console.error('Failed to create room:', err);
            return null;
        }
    }

    async joinRoom(sessionId) {
        if (!this.isOnline) return null;
        
        try {
            const response = await fetch(`${this.serverUrl}/api/sessions/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: this.playerId,
                    playerName: this.playerName,
                    sessionId: sessionId
                })
            });
            
            const data = await response.json();
            this.currentRoom = sessionId;
            this.partyMembers = data.players || [];
            return data;
        } catch (err) {
            console.error('Failed to join room:', err);
            return null;
        }
    }

    async getAvailableRooms() {
        if (!this.isOnline) return [];
        
        try {
            const response = await fetch(`${this.serverUrl}/api/sessions/list`);
            const data = await response.json();
            return data.sessions || [];
        } catch (err) {
            return [];
        }
    }

    async broadcastPlayerState(gameState) {
        if (!this.isOnline || !this.currentRoom) return;
        
        try {
            await fetch(`${this.serverUrl}/api/gamestate/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: this.playerId,
                    sessionId: this.currentRoom,
                    state: gameState
                })
            });
        } catch (err) {
            // Silent fail
        }
    }

    async leaveRoom() {
        if (!this.isOnline || !this.currentRoom) return;
        
        try {
            await fetch(`${this.serverUrl}/api/sessions/leave`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: this.playerId,
                    sessionId: this.currentRoom
                })
            });
            
            this.currentRoom = null;
            this.partyMembers = [];
        } catch (err) {
            console.error('Failed to leave room:', err);
        }
    }
}

const multiplayerManager = new MultiplayerManager();
