// ============================================
// STORY SYSTEM - Dynamic Narrative Generation
// ============================================

class StorySystem {
    constructor() {
        this.currentFloor = 1;
        this.storyLog = [];
        this.characterEncounters = {};
        this.environmentTheme = 'ancient_ruins';
        this.narrativeState = {};
        
        this.floorThemes = {
            1: { name: 'Ancient Ruins', icon: '🏛️', atmosphere: 'You descend into weathered stone corridors, dust dancing in ancient light.' },
            2: { name: 'Crystal Caverns', icon: '💎', atmosphere: 'Luminescent crystals cast an eerie blue glow on jagged cave walls.' },
            3: { name: 'Corrupted Garden', icon: '🌀', atmosphere: 'Once beautiful gardens twist with dark corruption and grotesque growth.' },
            4: { name: 'Mechanical Depths', icon: '⚙️', atmosphere: 'Ancient machinery hums with forgotten purpose, gears grinding endlessly.' },
            5: { name: 'Abyss Core', icon: '🌑', atmosphere: 'Reality fractures at the edges. Something ancient stirs in the darkness.' }
        };

        this.storyEvents = {
            encounterAlly: [
                "A lone survivor emerges from the shadows, offering cryptic warnings about the dangers ahead.",
                "A mysterious merchant materializes, offering rare equipment at exorbitant prices.",
                "An echo of a past adventurer provides wisdom before fading away.",
                "A wounded creature begs for aid, testing your compassion."
            ],
            encounterTrap: [
                "The ground gives way beneath your feet—a ancient trap activates!",
                "Pressure plates trigger a cascading wave of projectiles!",
                "The air fills with toxic spores from dormant mechanisms.",
                "Ancient sentries rise from stone slumber!"
            ],
            encounterCurse: [
                "A haunting presence envelops you—your abilities grow weak.",
                "Cursed runes suddenly appear, draining your essence.",
                "Time itself seems to slow around you.",
                "Your weapons falter as dark magic interferes."
            ],
            environmentChange: [
                "The dungeon shifts around you—walls reconfigure!",
                "Portals flicker open and close unpredictably.",
                "The atmosphere changes—you feel stronger here.",
                "Gravity anomalies make movement uncertain."
            ]
        };
    }

    generateFloorTheme(floorNumber) {
        const themeIndex = ((floorNumber - 1) % Object.keys(this.floorThemes).length) + 1;
        return this.floorThemes[themeIndex] || this.floorThemes[1];
    }

    getRandomStoryEvent(type) {
        const events = this.storyEvents[type] || [];
        return events[Math.floor(Math.random() * events.length)];
    }

    generateFloorNarrative(floorNumber, difficulty) {
        const theme = this.generateFloorTheme(floorNumber);
        const event = this.getRandomStoryEvent('encounterAlly');
        
        return {
            title: `Floor ${floorNumber}: ${theme.name} ${theme.icon}`,
            atmosphere: theme.atmosphere,
            event: event,
            difficulty: difficulty,
            rewards: this.calculateRewards(floorNumber, difficulty)
        };
    }

    calculateRewards(floorNumber, difficulty) {
        const baseGold = 100 * floorNumber;
        const difficultyMult = { easy: 0.5, normal: 1, hard: 1.5, insane: 2 };
        const mult = difficultyMult[difficulty] || 1;
        return Math.round(baseGold * mult);
    }

    addStoryEvent(event) {
        this.storyLog.push({
            timestamp: Date.now(),
            floor: this.currentFloor,
            event: event
        });
    }
}

const storySystem = new StorySystem();
