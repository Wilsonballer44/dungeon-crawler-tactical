// ============================================
// DUNGEON SYSTEM - Procedurally Generated Floors
// ============================================

class DungeonFloor {
    constructor(floorNumber, difficulty) {
        this.floorNumber = floorNumber;
        this.difficulty = difficulty;
        this.floorStyle = this.generateFloorStyle();
        this.layout = this.generateLayout();
        this.hazards = this.generateHazards();
        this.lootLocations = this.generateLootLocations();
    }

    generateFloorStyle() {
        const styles = [
            { name: 'Ancient Stone', color: '#666666', pattern: 'bricks' },
            { name: 'Crystal Cavern', color: '#3366ff', pattern: 'crystals' },
            { name: 'Corrupted Flesh', color: '#663366', pattern: 'organic' },
            { name: 'Mechanical', color: '#999999', pattern: 'gears' },
            { name: 'Void Space', color: '#1a0033', pattern: 'void' },
            { name: 'Corrupted Grove', color: '#336633', pattern: 'vegetation' },
            { name: 'Lava Flows', color: '#ff6600', pattern: 'magma' },
            { name: 'Ice Fortress', color: '#00ccff', pattern: 'ice' }
        ];
        
        return styles[this.floorNumber % styles.length];
    }

    generateLayout() {
        const layout = {
            rooms: [],
            corridors: [],
            walls: []
        };

        // Generate 3-6 random rooms
        const roomCount = 3 + Math.floor(Math.random() * 4);
        const roomSize = 150;
        const gridSize = 400;

        for (let i = 0; i < roomCount; i++) {
            const x = (Math.floor(Math.random() * 2) + 1) * gridSize + (Math.random() - 0.5) * 200;
            const y = (Math.floor(Math.random() * 2) + 1) * gridSize + (Math.random() - 0.5) * 200;
            
            layout.rooms.push({
                x: x,
                y: y,
                width: roomSize + Math.random() * 100,
                height: roomSize + Math.random() * 100,
                connected: false
            });
        }

        return layout;
    }

    generateHazards() {
        const hazards = [];
        const hazardCount = 2 + this.floorNumber;
        const styles = ['spikes', 'poison_gas', 'lava', 'ice', 'electricity', 'void_tear'];

        for (let i = 0; i < hazardCount; i++) {
            hazards.push({
                type: styles[Math.floor(Math.random() * styles.length)],
                x: Math.random() * 1600,
                y: Math.random() * 900,
                radius: 50 + Math.random() * 100,
                damage: 10 + (this.floorNumber * 3),
                icon: this.getHazardIcon(styles[i % styles.length])
            });
        }

        return hazards;
    }

    getHazardIcon(type) {
        const icons = {
            spikes: '⚔️',
            poison_gas: '☠️',
            lava: '🔥',
            ice: '❄️',
            electricity: '⚡',
            void_tear: '🌀'
        };
        return icons[type] || '⚠️';
    }

    generateLootLocations() {
        const locations = [];
        const lootCount = 2 + Math.floor(this.floorNumber / 2);

        for (let i = 0; i < lootCount; i++) {
            locations.push({
                x: Math.random() * 1600,
                y: Math.random() * 900,
                rarity: Math.random() > 0.7 ? 'rare' : 'common',
                icon: '📦'
            });
        }

        return locations;
    }

    draw(ctx) {
        // Draw floor style background
        ctx.fillStyle = this.floorStyle.color;
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = 1;

        // Draw rooms
        ctx.strokeStyle = '#00ff00';
        ctx.globalAlpha = 0.3;
        this.layout.rooms.forEach(room => {
            ctx.strokeRect(room.x - room.width / 2, room.y - room.height / 2, room.width, room.height);
        });
        ctx.globalAlpha = 1;

        // Draw hazards
        this.hazards.forEach(hazard => {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(hazard.icon, hazard.x, hazard.y);
        });

        // Draw loot locations
        this.lootLocations.forEach(loot => {
            ctx.fillStyle = loot.rarity === 'rare' ? '#ffaa00' : '#ffff00';
            ctx.beginPath();
            ctx.arc(loot.x, loot.y, 15, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#000';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(loot.icon, loot.x, loot.y + 4);
        });
    }
}

class DungeonSystem {
    constructor() {
        this.currentFloor = 1;
        this.currentDifficulty = 'normal';
        this.floor = null;
        this.floorsCompleted = [];
    }

    initiateFloor(floorNumber, difficulty) {
        this.currentFloor = floorNumber;
        this.currentDifficulty = difficulty;
        this.floor = new DungeonFloor(floorNumber, difficulty);
        return this.floor;
    }

    getFloorTheme() {
        return this.floor.floorStyle;
    }

    checkHazardCollision(x, y, radius) {
        for (let hazard of this.floor.hazards) {
            const dx = x - hazard.x;
            const dy = y - hazard.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (hazard.radius + radius)) {
                return hazard;
            }
        }
        return null;
    }

    nextFloor() {
        this.floorsCompleted.push(this.currentFloor);
        this.currentFloor++;
        this.floor = new DungeonFloor(this.currentFloor, this.currentDifficulty);
        return this.floor;
    }
}

// Create global dungeon system
const dungeonSystem = new DungeonSystem();
