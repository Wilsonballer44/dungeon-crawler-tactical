// ============================================
// SERVER - Node.js/Express Backend
// Run this with: node server.js
// ============================================

const express = require('express');
const cors = require('cors');
const http = require('http');
const uuid = require('uuid');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// In-memory storage (use database in production)
const players = new Map();
const rooms = new Map();
const gameStates = new Map();

// ============================================
// PLAYER MANAGEMENT
// ============================================

app.post('/api/connect', (req, res) => {
    const playerId = uuid.v4();
    const player = {
        id: playerId,
        name: req.body.playerName,
        connectedAt: Date.now(),
        stats: {
            kills: 0,
            deaths: 0,
            goldCollected: 0,
            floorsReached: 1
        }
    };
    
    players.set(playerId, player);
    console.log(`Player connected: ${player.name} (${playerId})`);
    
    res.json({ playerId: playerId, message: 'Connected to server' });
});

app.post('/api/heartbeat', (req, res) => {
    const playerId = req.body.playerId;
    if (players.has(playerId)) {
        players.get(playerId).lastHeartbeat = Date.now();
        res.json({ status: 'ok' });
    } else {
        res.status(404).json({ error: 'Player not found' });
    }
});

// ============================================
// ROOM MANAGEMENT
// ============================================

app.post('/api/rooms/create', (req, res) => {
    const roomId = uuid.v4();
    const room = {
        id: roomId,
        hostId: req.body.playerId,
        difficulty: req.body.difficulty,
        maxPlayers: req.body.maxPlayers || 4,
        players: [{ id: req.body.playerId, name: players.get(req.body.playerId).name }],
        createdAt: Date.now(),
        status: 'waiting'
    };
    
    rooms.set(roomId, room);
    gameStates.set(roomId, {
        floor: 1,
        enemyCount: 0,
        players: {}
    });
    
    console.log(`Room created: ${roomId}`);
    res.json({ roomId: roomId, status: 'created' });
});

app.get('/api/rooms/list', (req, res) => {
    const availableRooms = Array.from(rooms.values())
        .filter(r => r.status === 'waiting' && r.players.length < r.maxPlayers)
        .map(r => ({
            id: r.id,
            difficulty: r.difficulty,
            playerCount: r.players.length,
            maxPlayers: r.maxPlayers
        }));
    
    res.json({ rooms: availableRooms });
});

app.post('/api/rooms/join', (req, res) => {
    const roomId = req.body.roomId;
    const playerId = req.body.playerId;
    const playerName = req.body.playerName;
    
    if (!rooms.has(roomId)) {
        return res.status(404).json({ error: 'Room not found' });
    }
    
    const room = rooms.get(roomId);
    
    if (room.players.length >= room.maxPlayers) {
        return res.status(400).json({ error: 'Room is full' });
    }
    
    room.players.push({ id: playerId, name: playerName });
    console.log(`Player ${playerName} joined room ${roomId}`);
    
    res.json({ 
        roomId: roomId, 
        players: room.players,
        difficulty: room.difficulty,
        status: 'joined'
    });
});

app.post('/api/rooms/leave', (req, res) => {
    const roomId = req.body.roomId;
    const playerId = req.body.playerId;
    
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.players = room.players.filter(p => p.id !== playerId);
        
        if (room.players.length === 0) {
            rooms.delete(roomId);
            gameStates.delete(roomId);
            console.log(`Room deleted: ${roomId}`);
        }
    }
    
    res.json({ status: 'left' });
});

// ============================================
// GAME STATE SYNCHRONIZATION
// ============================================

app.post('/api/gamestate/update', (req, res) => {
    const roomId = req.body.roomId;
    const playerId = req.body.playerId;
    const state = req.body.state;
    
    if (!gameStates.has(roomId)) {
        return res.status(404).json({ error: 'Game state not found' });
    }
    
    const gameState = gameStates.get(roomId);
    gameState.players = gameState.players || {};
    gameState.players[playerId] = {
        ...state,
        lastUpdate: Date.now()
    };
    
    res.json({ status: 'updated' });
});

app.get('/api/gamestate/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    
    if (!gameStates.has(roomId)) {
        return res.status(404).json({ error: 'Game state not found' });
    }
    
    const gameState = gameStates.get(roomId);
    res.json(gameState);
});

// ============================================
// STATISTICS & LEADERBOARD
// ============================================

app.post('/api/stats/kill', (req, res) => {
    const playerId = req.body.playerId;
    
    if (players.has(playerId)) {
        const player = players.get(playerId);
        player.stats.kills++;
        player.stats.goldCollected += req.body.gold || 0;
    }
    
    res.json({ status: 'recorded' });
});

app.get('/api/leaderboard', (req, res) => {
    const leaderboard = Array.from(players.values())
        .map(p => ({
            name: p.name,
            kills: p.stats.kills,
            floorsReached: p.stats.floorsReached,
            goldCollected: p.stats.goldCollected
        }))
        .sort((a, b) => b.floorsReached - a.floorsReached || b.kills - a.kills)
        .slice(0, 10);
    
    res.json({ leaderboard: leaderboard });
});

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🎮 Dungeon Crawler Server running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
});

// Cleanup inactive players every 30 seconds
setInterval(() => {
    const now = Date.now();
    const timeout = 30000; // 30 seconds
    
    for (const [playerId, player] of players.entries()) {
        if (now - (player.lastHeartbeat || player.connectedAt) > timeout) {
            players.delete(playerId);
            console.log(`Player ${player.name} disconnected (timeout)`);
        }
    }
}, 30000);
