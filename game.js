// ============================================
// DUNGEON CRAWLER: TACTICAL SIEGE
// Advanced Game Engine with Tactical Combat
// ============================================

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const minimap = document.getElementById('minimap');
const minimapCtx = minimap.getContext('2d');

// Resize canvas to window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ============================================
// GAME CONSTANTS & CONFIG
// ============================================

const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    WAVE_END: 'wave_end',
    GAME_OVER: 'game_over'
};

const RARITY = {
    COMMON: { name: 'Common', color: '#ffffff', weight: 0.6 },
    UNCOMMON: { name: 'Uncommon', color: '#00ff00', weight: 0.25 },
    RARE: { name: 'Rare', color: '#0099ff', weight: 0.1 },
    EPIC: { name: 'Epic', color: '#ff00ff', weight: 0.04 },
    LEGENDARY: { name: 'Legendary', color: '#ffaa00', weight: 0.01 }
};

const ITEM_TYPES = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    CONSUMABLE: 'consumable',
    ABILITY: 'ability',
    UTILITY: 'utility'
};

// ============================================
// WEAPON SYSTEM
// ============================================

const WEAPONS = {
    // Pistols
    PISTOL_9MM: {
        name: 'Tactical 9mm',
        type: 'pistol',
        damage: 15,
        fireRate: 0.15,
        accuracy: 0.85,
        clipSize: 12,
        reloadTime: 1.2,
        range: 400,
        spread: 8,
        icon: '🔫'
    },
    PISTOL_ENERGY: {
        name: 'Plasma Pistol',
        type: 'pistol',
        damage: 22,
        fireRate: 0.2,
        accuracy: 0.9,
        clipSize: 10,
        reloadTime: 1.5,
        range: 350,
        spread: 5,
        icon: '⚡',
        rarity: RARITY.RARE
    },

    // Rifles
    RIFLE_ASSAULT: {
        name: 'Assault Rifle',
        type: 'rifle',
        damage: 25,
        fireRate: 0.08,
        accuracy: 0.75,
        clipSize: 30,
        reloadTime: 2.0,
        range: 600,
        spread: 12,
        icon: '🔭'
    },
    RIFLE_SNIPER: {
        name: 'Tactical Sniper',
        type: 'rifle',
        damage: 80,
        fireRate: 0.5,
        accuracy: 0.98,
        clipSize: 5,
        reloadTime: 3.0,
        range: 1200,
        spread: 2,
        icon: '🎯',
        rarity: RARITY.EPIC
    },
    RIFLE_BURST: {
        name: 'Burst Rifle',
        type: 'rifle',
        damage: 20,
        fireRate: 0.12,
        accuracy: 0.8,
        clipSize: 24,
        reloadTime: 1.8,
        range: 550,
        spread: 10,
        icon: '💥'
    },

    // Shotguns
    SHOTGUN_PUMP: {
        name: 'Pump Shotgun',
        type: 'shotgun',
        damage: 60,
        fireRate: 0.4,
        accuracy: 0.6,
        clipSize: 8,
        reloadTime: 2.2,
        range: 250,
        spread: 35,
        icon: '🔊',
        pellets: 8
    },
    SHOTGUN_AUTO: {
        name: 'Combat Shotgun',
        type: 'shotgun',
        damage: 45,
        fireRate: 0.2,
        accuracy: 0.65,
        clipSize: 12,
        reloadTime: 2.5,
        range: 280,
        spread: 40,
        icon: '💢',
        pellets: 10,
        rarity: RARITY.RARE
    },

    // Heavy
    MINIGUN: {
        name: 'Tactical Minigun',
        type: 'heavy',
        damage: 18,
        fireRate: 0.05,
        accuracy: 0.7,
        clipSize: 200,
        reloadTime: 3.5,
        range: 500,
        spread: 15,
        icon: '⚙️',
        rarity: RARITY.EPIC
    },
    LAUNCHER_ROCKET: {
        name: 'Rocket Launcher',
        type: 'heavy',
        damage: 120,
        fireRate: 1.2,
        accuracy: 0.9,
        clipSize: 6,
        reloadTime: 4.0,
        range: 800,
        spread: 3,
        icon: '🚀',
        aoe: 150,
        rarity: RARITY.LEGENDARY
    },

    // Special
    LASER_RIFLE: {
        name: 'Laser Rifle',
        type: 'special',
        damage: 35,
        fireRate: 0.25,
        accuracy: 0.95,
        clipSize: 50,
        reloadTime: 1.5,
        range: 800,
        spread: 1,
        icon: '🔴',
        rarity: RARITY.EPIC
    },
    FLAME_THROWER: {
        name: 'Flame Thrower',
        type: 'special',
        damage: 40,
        fireRate: 0.1,
        accuracy: 0.5,
        clipSize: 100,
        reloadTime: 2.0,
        range: 300,
        spread: 45,
        icon: '🔥',
        rarity: RARITY.RARE,
        dotDamage: 5,
        dotDuration: 3
    }
};

// ============================================
// ARMOR & EQUIPMENT SYSTEM
// ============================================

const ARMOR = {
    LIGHT_VEST: {
        name: 'Light Tactical Vest',
        type: 'chest',
        armor: 15,
        speed: 1.0,
        icon: '🎽'
    },
    HEAVY_PLATE: {
        name: 'Reinforced Body Armor',
        type: 'chest',
        armor: 35,
        speed: 0.85,
        icon: '🛡️',
        rarity: RARITY.RARE
    },
    POWER_SUIT: {
        name: 'Exo-Skeleton Suit',
        type: 'chest',
        armor: 60,
        speed: 1.2,
        icon: '🤖',
        rarity: RARITY.LEGENDARY,
        mods: { damage: 1.1, health: 1.15 }
    },
    HELMET_BASIC: {
        name: 'Combat Helmet',
        type: 'head',
        armor: 10,
        icon: '⚔️'
    },
    HELMET_TECH: {
        name: 'Smart Helmet w/ HUD',
        type: 'head',
        armor: 15,
        icon: '👾',
        rarity: RARITY.RARE,
        perception: 1.2
    },
    BOOTS_SPEED: {
        name: 'Tactical Sprint Boots',
        type: 'feet',
        speed: 1.3,
        icon: '👢',
        rarity: RARITY.RARE
    },
    BOOTS_JUMP: {
        name: 'Hydraulic Jump Boots',
        type: 'feet',
        speed: 1.1,
        jumpHeight: 1.5,
        icon: '🦘',
        rarity: RARITY.EPIC
    }
};

// ============================================
// CONSUMABLES & BUFFS
// ============================================

const CONSUMABLES = {
    HEALTH_POTION: {
        name: 'Health Potion',
        type: 'consumable',
        heal: 30,
        icon: '🧪',
        rarity: RARITY.COMMON
    },
    MEGA_HEALTH: {
        name: 'Mega Health Pack',
        type: 'consumable',
        heal: 100,
        icon: '💊',
        rarity: RARITY.RARE
    },
    AMMO_PACK: {
        name: 'Ammunition Cache',
        type: 'consumable',
        ammo: 60,
        icon: '📦',
        rarity: RARITY.COMMON
    },
    SPEED_BOOST: {
        name: 'Adrenaline Shot',
        type: 'buff',
        duration: 8,
        speedMod: 1.5,
        icon: '💉',
        rarity: RARITY.UNCOMMON
    },
    DAMAGE_BOOST: {
        name: 'Berserker Serum',
        type: 'buff',
        duration: 6,
        damageMod: 1.8,
        icon: '⚡',
        rarity: RARITY.UNCOMMON
    },
    ARMOR_BOOST: {
        name: 'Hardened Shield Buff',
        type: 'buff',
        duration: 10,
        armorMod: 2.0,
        icon: '🛡️',
        rarity: RARITY.UNCOMMON
    },
    VISION_BOOST: {
        name: 'Thermal Vision Goggles',
        type: 'buff',
        duration: 12,
        visionRange: 1.5,
        icon: '👁️',
        rarity: RARITY.RARE
    }
};

// ============================================
// ABILITIES & SPECIAL SKILLS
// ============================================

const ABILITIES = {
    DASH: {
        name: 'Tactical Dash',
        icon: '⚡',
        cooldown: 3,
        duration: 0.3,
        speed: 800,
        description: 'Quick evasive maneuver'
    },
    SHIELD_BARRIER: {
        name: 'Shield Barrier',
        icon: '🛡️',
        cooldown: 8,
        duration: 4,
        shieldAmount: 50,
        description: 'Temporary damage absorption',
        rarity: RARITY.RARE
    },
    EXPLOSIVE_STRIKE: {
        name: 'Explosive Strike',
        icon: '💥',
        cooldown: 6,
        damage: 80,
        aoe: 120,
        description: 'Area damage ability',
        rarity: RARITY.RARE
    },
    ICE_FIELD: {
        name: 'Ice Field',
        icon: '❄️',
        cooldown: 10,
        duration: 5,
        slowAmount: 0.5,
        aoe: 200,
        description: 'Slow enemies in radius',
        rarity: RARITY.EPIC
    },
    TELEPORT: {
        name: 'Blink Teleport',
        icon: '✨',
        cooldown: 12,
        range: 300,
        description: 'Short range teleportation',
        rarity: RARITY.EPIC
    },
    ULTIMATE_FURY: {
        name: 'Berserker Fury',
        icon: '⭐',
        cooldown: 45,
        duration: 8,
        damageMod: 2.5,
        speedMod: 1.8,
        description: 'Massive power boost',
        rarity: RARITY.LEGENDARY
    }
};

// ============================================
// UTILITY & GADGETS
// ============================================

const UTILITIES = {
    SMOKE_BOMB: {
        name: 'Smoke Bomb',
        type: 'tactical',
        aoe: 150,
        duration: 4,
        visionReduction: 0.3,
        icon: '💨',
        stack: 3,
        rarity: RARITY.UNCOMMON
    },
    EMP_GRENADE: {
        name: 'EMP Grenade',
        type: 'tactical',
        aoe: 200,
        disableDuration: 2,
        icon: '⚡',
        stack: 2,
        rarity: RARITY.RARE
    },
    PROXIMITY_MINE: {
        name: 'Proximity Mine',
        type: 'trap',
        damage: 100,
        aoe: 150,
        triggerRadius: 50,
        icon: '💣',
        stack: 4,
        rarity: RARITY.RARE
    },
    DECOY: {
        name: 'Tactical Decoy',
        type: 'utility',
        duration: 8,
        icon: '👤',
        stack: 2,
        rarity: RARITY.UNCOMMON
    },
    RADAR: {
        name: 'Enemy Radar',
        type: 'sensor',
        range: 400,
        duration: 15,
        icon: '📡',
        rarity: RARITY.RARE
    }
};

// ============================================
// ITEM GENERATION & LOOT SYSTEM
// ============================================

class ItemGenerator {
    static generateWeapon(tierBonus = 1) {
        const weapons = Object.values(WEAPONS);
        const rarity = this.selectRarity();
        const filtered = weapons.filter(w => (w.rarity || RARITY.COMMON) === rarity);
        const weapon = filtered[Math.floor(Math.random() * filtered.length)] || weapons[0];
        
        return {
            id: Math.random(),
            ...weapon,
            rarity: rarity,
            level: Math.floor(Math.random() * 3) + tierBonus,
            statBoost: 1 + (Math.random() * 0.2)
        };
    }

    static generateArmor(tierBonus = 1) {
        const armors = Object.values(ARMOR);
        const armor = armors[Math.floor(Math.random() * armors.length)];
        
        return {
            id: Math.random(),
            ...armor,
            rarity: armor.rarity || RARITY.COMMON,
            level: Math.floor(Math.random() * 3) + tierBonus,
            statBoost: 1 + (Math.random() * 0.15)
        };
    }

    static generateConsumable() {
        const consumables = Object.values(CONSUMABLES);
        const item = consumables[Math.floor(Math.random() * consumables.length)];
        
        return {
            id: Math.random(),
            ...item,
            rarity: item.rarity || RARITY.COMMON,
            quantity: Math.floor(Math.random() * 3) + 1
        };
    }

    static generateLootDrop(enemyLevel) {
        const roll = Math.random();
        const tierBonus = Math.floor(enemyLevel / 5);

        if (roll < 0.5) return this.generateWeapon(tierBonus);
        if (roll < 0.75) return this.generateArmor(tierBonus);
        return this.generateConsumable();
    }

    static selectRarity() {
        const roll = Math.random();
        let cumulative = 0;
        for (const [key, rarity] of Object.entries(RARITY)) {
            cumulative += rarity.weight;
            if (roll <= cumulative) return rarity;
        }
        return RARITY.LEGENDARY;
    }
}

// ============================================
// PLAYER CLASS
// ============================================

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 40;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.armor = 0;
        this.speed = 150;
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Weapon & Ammo
        this.currentWeapon = WEAPONS.PISTOL_9MM;
        this.ammo = this.currentWeapon.clipSize;
        this.maxAmmo = this.currentWeapon.clipSize;
        this.weaponInventory = [WEAPONS.PISTOL_9MM];
        
        // Armor
        this.armorEquipped = {};
        this.inventory = [];
        this.gold = 0;
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 100;
        
        // Abilities
        this.abilities = {};
        this.cooldowns = {};
        this.activeBuffs = [];
        
        // Combat
        this.lastDamageTime = 0;
        this.lastAttackTime = 0;
        this.isReloading = false;
        this.reloadProgress = 0;
        
        // Movement
        this.isMoving = false;
        this.dashActive = false;
        this.dashDirection = 0;
        
        // Stats Modifiers
        this.speedMod = 1;
        this.damageMod = 1;
        this.armorMod = 1;
        
        // Add starting ability
        this.abilities.dash = { ...ABILITIES.DASH, cooldownRemaining: 0 };
    }

    takeDamage(damage) {
        const actualDamage = Math.max(1, damage - (this.armor * this.armorMod));
        this.health = Math.max(0, this.health - actualDamage);
        this.lastDamageTime = Date.now();
        return actualDamage;
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    addWeapon(weapon) {
        if (this.weaponInventory.length < 3) {
            this.weaponInventory.push(weapon);
        }
    }

    switchWeapon(index) {
        if (index < this.weaponInventory.length) {
            this.currentWeapon = this.weaponInventory[index];
            this.ammo = this.currentWeapon.clipSize;
            this.isReloading = false;
        }
    }

    reload() {
        if (!this.isReloading && this.ammo < this.maxAmmo) {
            this.isReloading = true;
            this.reloadProgress = 0;
        }
    }

    updateReload(deltaTime) {
        if (this.isReloading) {
            this.reloadProgress += deltaTime / this.currentWeapon.reloadTime;
            if (this.reloadProgress >= 1) {
                this.ammo = this.currentWeapon.clipSize;
                this.isReloading = false;
                this.reloadProgress = 0;
            }
        }
    }

    fire() {
        if (this.ammo > 0 && !this.isReloading && Date.now() - this.lastAttackTime > this.currentWeapon.fireRate * 1000) {
            this.lastAttackTime = Date.now();
            this.ammo--;
            return true;
        }
        return false;
    }

    activateAbility(abilityKey) {
        const ability = this.abilities[abilityKey];
        if (ability && ability.cooldownRemaining <= 0) {
            ability.cooldownRemaining = ability.cooldown;
            return true;
        }
        return false;
    }

    updateBuffs(deltaTime) {
        this.activeBuffs = this.activeBuffs.filter(buff => {
            buff.duration -= deltaTime;
            return buff.duration > 0;
        });

        // Reset modifiers
        this.speedMod = 1;
        this.damageMod = 1;
        this.armorMod = 1;

        // Apply active buffs
        this.activeBuffs.forEach(buff => {
            if (buff.speedMod) this.speedMod *= buff.speedMod;
            if (buff.damageMod) this.damageMod *= buff.damageMod;
            if (buff.armorMod) this.armorMod *= buff.armorMod;
        });
    }

    updateCooldowns(deltaTime) {
        Object.values(this.abilities).forEach(ability => {
            if (ability.cooldownRemaining > 0) {
                ability.cooldownRemaining -= deltaTime;
            }
        });
    }

    update(deltaTime, keys) {
        this.updateBuffs(deltaTime);
        this.updateCooldowns(deltaTime);
        this.updateReload(deltaTime);

        // Movement
        this.velocityX = 0;
        this.velocityY = 0;

        if (keys['w'] || keys['ArrowUp']) this.velocityY = -this.speed * this.speedMod;
        if (keys['s'] || keys['ArrowDown']) this.velocityY = this.speed * this.speedMod;
        if (keys['a'] || keys['ArrowLeft']) this.velocityX = -this.speed * this.speedMod;
        if (keys['d'] || keys['ArrowRight']) this.velocityX = this.speed * this.speedMod;

        this.x += (this.velocityX * deltaTime);
        this.y += (this.velocityY * deltaTime);

        // Keep in bounds
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));

        this.isMoving = this.velocityX !== 0 || this.velocityY !== 0;
    }

    draw() {
        // Draw player body
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw health indicator
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(this.x, this.y - 10, this.width * healthPercent, 5);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(this.x, this.y - 10, this.width, 5);

        // Draw weapon indicator
        ctx.fillStyle = '#ffaa00';
        ctx.font = '12px Arial';
        ctx.fillText(this.currentWeapon.icon, this.x + 8, this.y + 25);

        // Draw loading indicator if reloading
        if (this.isReloading) {
            ctx.fillStyle = 'rgba(255, 100, 0, 0.7)';
            ctx.fillRect(this.x, this.y - 20, this.width * this.reloadProgress, 3);
        }
    }
}

// ============================================
// ENEMY CLASS
// ============================================

class Enemy {
    constructor(x, y, level = 1) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 30;
        this.level = level;
        this.maxHealth = 30 + (level * 10);
        this.health = this.maxHealth;
        this.armor = level * 2;
        this.speed = 80 + (level * 5);
        this.damage = 10 + (level * 3);
        this.range = 300;
        this.detectionRange = 400;
        this.velocityX = 0;
        this.velocityY = 0;
        this.lastAttackTime = 0;
        this.attackCooldown = 0.8;
        this.targetX = x;
        this.targetY = y;
        this.state = 'idle'; // idle, chase, attack
        this.color = this.getColorByLevel();
    }

    getColorByLevel() {
        if (this.level > 10) return '#ff0000'; // Red for hard
        if (this.level > 5) return '#ff6600'; // Orange for medium
        return '#ffff00'; // Yellow for easy
    }

    update(deltaTime, playerX, playerY) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.detectionRange) {
            this.state = 'chase';
            const angle = Math.atan2(dy, dx);
            this.velocityX = Math.cos(angle) * this.speed;
            this.velocityY = Math.sin(angle) * this.speed;
        } else {
            this.state = 'idle';
            this.velocityX *= 0.9;
            this.velocityY *= 0.9;
        }

        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Keep in bounds
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }

    draw() {
        // Draw enemy
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw health bar
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : '#ff0000';
        ctx.fillRect(this.x, this.y - 8, this.width * healthPercent, 3);
    }

    takeDamage(damage) {
        const actualDamage = Math.max(1, damage - this.armor);
        this.health -= actualDamage;
        return actualDamage;
    }
}

// ============================================
// PARTICLE & EFFECTS SYSTEM
// ============================================

class Particle {
    constructor(x, y, vx, vy, life, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.color = color;
    }

    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.vy += 200 * deltaTime; // Gravity
        this.life -= deltaTime;
    }

    draw() {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// ============================================
// GAME MANAGER
// ============================================

class GameManager {
    constructor() {
        this.player = new Player(canvas.width / 2, canvas.height / 2);
        this.enemies = [];
        this.particles = [];
        this.wave = 1;
        this.waveEnemies = 5;
        this.enemiesDefeated = 0;
        this.gameState = GAME_STATE.PLAYING;
        this.keys = {};
        this.gold = 0;
        this.killFeed = [];
        
        this.setupEventListeners();
        this.spawnWave();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Abilities
            if (e.key.toLowerCase() === 'q') this.player.activateAbility('dash');
            if (e.key.toLowerCase() === 'e') this.player.activateAbility('shield');
            if (e.key.toLowerCase() === 'r') this.player.reload();
            if (e.key.toLowerCase() === 'x') this.player.activateAbility('ultimate');

            // Weapon switching
            if (e.key === '1') this.player.switchWeapon(0);
            if (e.key === '2') this.player.switchWeapon(1);
            if (e.key === '3') this.player.switchWeapon(2);
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        canvas.addEventListener('click', (e) => {
            if (this.gameState === GAME_STATE.PLAYING) {
                this.playerFire(e.clientX, e.clientY);
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            document.getElementById('crosshair').style.left = (e.clientX - 15) + 'px';
            document.getElementById('crosshair').style.top = (e.clientY - 15) + 'px';
            document.getElementById('crosshair').style.display = 'block';
        });
    }

    spawnWave() {
        for (let i = 0; i < this.waveEnemies; i++) {
            const angle = (i / this.waveEnemies) * Math.PI * 2;
            const distance = 300;
            const x = canvas.width / 2 + Math.cos(angle) * distance;
            const y = canvas.height / 2 + Math.sin(angle) * distance;
            this.enemies.push(new Enemy(x, y, this.wave));
        }
    }

    playerFire(mouseX, mouseY) {
        if (this.player.fire()) {
            const dx = mouseX - this.player.x;
            const dy = mouseY - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            // Check for hit
            for (let enemy of this.enemies) {
                const edx = enemy.x - this.player.x;
                const edy = enemy.y - this.player.y;
                const edist = Math.sqrt(edx * edx + edy * edy);

                if (edist < this.player.currentWeapon.range) {
                    const angleToEnemy = Math.atan2(edy, edx);
                    const angleDiff = Math.abs(angleToEnemy - angle);
                    const accuracy = this.player.currentWeapon.accuracy;

                    if (angleDiff < accuracy) {
                        const damage = this.player.currentWeapon.damage * this.player.damageMod;
                        const actualDamage = enemy.takeDamage(damage);
                        
                        // Create hit effect
                        this.createHitEffect(enemy.x, enemy.y, actualDamage);

                        if (enemy.health <= 0) {
                            this.enemyDefeated(enemy);
                        }
                    }
                }
            }

            // Muzzle flash
            this.createMuzzleFlash();
        }
    }

    createMuzzleFlash() {
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 200 + Math.random() * 200;
            const particle = new Particle(
                this.player.x + 12,
                this.player.y + 20,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                0.3,
                '#ffaa00'
            );
            this.particles.push(particle);
        }
    }

    createHitEffect(x, y, damage) {
        // Create damage numbers
        const dmgText = document.createElement('div');
        dmgText.className = 'damageNumber';
        dmgText.textContent = Math.round(damage);
        dmgText.style.left = x + 'px';
        dmgText.style.top = y + 'px';
        document.getElementById('uiContainer').appendChild(dmgText);

        setTimeout(() => dmgText.remove(), 1000);

        // Create hit particles
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 150 + Math.random() * 150;
            const particle = new Particle(
                x, y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                0.5,
                '#ff3333'
            );
            this.particles.push(particle);
        }
    }

    enemyDefeated(enemy) {
        this.enemies = this.enemies.filter(e => e !== enemy);
        this.enemiesDefeated++;
        this.gold += 50 * this.wave;
        this.player.exp += 25 * this.wave;

        // Loot drop
        const loot = ItemGenerator.generateLootDrop(this.wave);
        
        // Add kill to feed
        const killText = `Defeated Level ${enemy.level} Enemy - +50 Gold`;
        this.killFeed.unshift(killText);
        if (this.killFeed.length > 5) this.killFeed.pop();

        // Drop particle effect
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 200;
            const particle = new Particle(
                enemy.x, enemy.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                1,
                '#ffaa00'
            );
            this.particles.push(particle);
        }

        if (this.enemies.length === 0) {
            this.completeWave();
        }
    }

    completeWave() {
        this.wave++;
        this.waveEnemies = 5 + (this.wave * 2);
        this.gameState = GAME_STATE.WAVE_END;
        document.getElementById('waveInfo').textContent = `Wave ${this.wave} Clear!`;
        document.getElementById('waveInfo').style.opacity = '1';
        
        setTimeout(() => {
            document.getElementById('waveInfo').style.opacity = '0';
            this.gameState = GAME_STATE.PLAYING;
            this.spawnWave();
        }, 3000);
    }

    updateUI() {
        document.getElementById('healthFill').textContent = `${Math.round(this.player.health)}/${this.player.maxHealth}`;
        document.getElementById('healthFill').style.width = (this.player.health / this.player.maxHealth * 100) + '%';
        
        document.getElementById('ammoFill').textContent = `${this.player.ammo}/${this.player.maxAmmo}`;
        document.getElementById('ammoFill').style.width = (this.player.ammo / this.player.maxAmmo * 100) + '%';
        
        document.getElementById('waveNum').textContent = this.wave;
        document.getElementById('goldNum').textContent = this.gold;

        // Update kill feed
        const killFeedEl = document.getElementById('killFeed');
        killFeedEl.innerHTML = this.killFeed.map(k => `<div class="killFeedItem">${k}</div>`).join('');

        // Update abilities cooldown UI
        const abilityIcons = document.querySelectorAll('.abilityIcon');
        abilityIcons.forEach(icon => {
            const abilityKey = icon.dataset.ability;
            const ability = this.player.abilities[abilityKey];
            const cooldownEl = icon.querySelector('.cooldown');
            
            if (ability && ability.cooldownRemaining > 0) {
                cooldownEl.style.display = 'flex';
                cooldownEl.textContent = ability.cooldownRemaining.toFixed(1);
                icon.classList.remove('active');
            } else {
                cooldownEl.style.display = 'none';
                if (ability) icon.classList.add('active');
            }
        });
    }

    update(deltaTime) {
        if (this.gameState !== GAME_STATE.PLAYING) return;

        this.player.update(deltaTime, this.keys);
        this.enemies.forEach(enemy => enemy.update(deltaTime, this.player.x, this.player.y));
        this.particles.forEach(p => p.update(deltaTime));
        this.particles = this.particles.filter(p => p.life > 0);

        // Enemy attacks
        this.enemies.forEach(enemy => {
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100 && Date.now() - enemy.lastAttackTime > enemy.attackCooldown * 1000) {
                enemy.lastAttackTime = Date.now();
                this.player.takeDamage(enemy.damage);
            }
        });

        // Game over check
        if (this.player.health <= 0) {
            this.gameState = GAME_STATE.GAME_OVER;
            document.getElementById('waveInfo').textContent = `GAME OVER! Wave ${this.wave}`;
            document.getElementById('waveInfo').style.opacity = '1';
        }

        this.updateUI();
    }

    draw() {
        // Clear canvas
        ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid background
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Draw game objects
        this.enemies.forEach(enemy => enemy.draw());
        this.particles.forEach(p => p.draw());
        this.player.draw();

        // Draw minimap
        minimapCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        minimapCtx.fillRect(0, 0, minimap.width, minimap.height);

        const scale = minimap.width / canvas.width;
        minimapCtx.fillStyle = '#00ff00';
        minimapCtx.fillRect(this.player.x * scale, this.player.y * scale, 5, 5);

        minimapCtx.fillStyle = '#ff0000';
        this.enemies.forEach(enemy => {
            minimapCtx.fillRect(enemy.x * scale, enemy.y * scale, 4, 4);
        });
    }
}

// ============================================
// MAIN GAME LOOP
// ============================================

let game;
let lastTime = Date.now();

function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    if (!game) {
        game = new GameManager();
    }

    game.update(deltaTime);
    game.draw();

    requestAnimationFrame(gameLoop);
}

// Start the game when page loads
window.addEventListener('load', () => {
    gameLoop();
});
