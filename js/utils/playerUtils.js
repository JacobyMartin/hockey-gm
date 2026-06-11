// playerUtils.js
// player factory + roster/team generation helpers

let nextPlayerId = 1;


// ===============================
// PUBLIC FACTORIES
// ===============================

export function createPlayer(pos = null) {
    const finalPos = pos || randomPick(["C", "LW", "RW", "D", "G"]);

    const player = {
        id: nextPlayerId++,
        name: generateName(),
        age: randomInt(18, 35),
        pos: finalPos,

        shooting: finalPos === "G" ? 0 : randomRating(),
        passing: finalPos === "G" ? 0 : randomRating(),
        offenseIQ: finalPos === "G" ? 0 : randomRating(),
        defense: finalPos === "G" ? 0 : randomRating(),
        defenseIQ: finalPos === "G" ? 0 : randomRating(),

        careerStats: {
            games: 0,
            goals: 0,
            assists: 0,
            points: 0
        },

        currentSeasonStats: {
            games: 0,
            goals: 0,
            assists: 0,
            points: 0
        },

        // future-ready fields
        fatigue: 0,
        mood: 50,
        contract: {
            salary: randomInt(1, 10), // placeholder units
            years: randomInt(1, 5)
        }
    };

    // goalie-only attributes
    if (finalPos === "G") {
        player.reflexes = randomRating();
        player.positioning = randomRating();
        player.puckControl = randomRating();
        player.reboundControl = randomRating();
        player.goalieIQ = randomRating();
    }

    return player;
}


export function createEasterEggPlayer() {
    return {
        id: nextPlayerId++,
        name: "Jacoby Martin",
        age: 22,
        pos: "C",

        shooting: 95,
        passing: 87,
        offenseIQ: 88,
        defense: 85,
        defenseIQ: 87,

        careerStats: {
            games: 0,
            goals: 0,
            assists: 0,
            points: 0
        },

        currentSeasonStats: {
            games: 0,
            goals: 0,
            assists: 0,
            points: 0
        },

        fatigue: 0,
        mood: 75,
        contract: {
            salary: 10,
            years: 5
        }
    };
}


/**
 * Generates a balanced roster:
 * 12 forwards, 6 defense, 2 goalies
 */
export function generateRoster(options = {}) {
    const {
        includeEasterEgg = false,
        easterEggChance = 0
    } = options;

    const roster = [];

    const forwardPositions = ["C", "LW", "RW"];

    // 2 franchise players (FORWARDS)
    for (let i = 0; i < 2; i++) {
        roster.push(createTierPlayer("star", randomPick(forwardPositions)));
    }

    // 3 strong players (FORWARDS / D MIX)
    for (let i = 0; i < 3; i++) {
        const pos = Math.random() < 0.7
            ? randomPick(forwardPositions)
            : "D";

        roster.push(createTierPlayer("top", pos));
    }

    // fill remaining forwards (to 12 total)
    while (roster.filter(p => forwardPositions.includes(p.pos)).length < 12) {
        roster.push(createTierPlayer("depth", randomPick(forwardPositions)));
    }

    // fill defense to 6 total
    while (roster.filter(p => p.pos === "D").length < 6) {
        roster.push(createTierPlayer("depth", "D"));
    }

    // 2 goalies
    for (let i = 0; i < 2; i++) {
        roster.push(createTierPlayer("top", "G"));
        if(i == 1){
            roster.push(createTierPlayer("depth", "G")); 
            i++; 
        }
    }

    // optional easter egg (replaces a forward)
    if (includeEasterEgg || Math.random() < easterEggChance) {
        const firstForwardIndex = roster.findIndex(
            player => ["C", "LW", "RW"].includes(player.pos)
        );

        if (firstForwardIndex !== -1) {
            roster[firstForwardIndex] = createEasterEggPlayer();
        }
    }

    return roster;
}


function createTierPlayer(tier, pos) {
    const player = createPlayer(pos);

    let base;

    if (tier === "star") base = randomInt(90, 96);
    else if (tier === "top") base = randomInt(84, 88);
    else base = randomInt(65, 83);

    // generate consistent attributes around base
    player.shooting = vary(base);
    player.passing = vary(base);
    player.offenseIQ = vary(base);
    player.defense = vary(base);
    player.defenseIQ = vary(base);

    // goalie override
    if (pos === "G") {
        player.reflexes = vary(base);
        player.positioning = vary(base);
        player.puckControl = vary(base);
        player.reboundControl = vary(base);
        player.goalieIQ = vary(base);
    }

    return player;
}


export function createTeam(name, options = {}) {
    return {
        name,
        roster: generateRoster(options),
        wins: 0,
        losses: 0
    };
}


/**
 * Optional helper if you ever need to guarantee stats exist
 * on players loaded from older saves.
 */
export function ensurePlayerStats(player) {
    if (!player.careerStats) {
        player.careerStats = {
            games: 0,
            goals: 0,
            assists: 0,
            points: 0
        };
    }

    if (!player.currentSeasonStats) {
        player.currentSeasonStats = {
            games: 0,
            goals: 0,
            assists: 0,
            points: 0
        };
    }

    if (player.fatigue === undefined) {
        player.fatigue = 0;
    }

    if (player.mood === undefined) {
        player.mood = 50;
    }

    if (!player.contract) {
        player.contract = {
            salary: randomInt(1, 10),
            years: randomInt(1, 5)
        };
    }
}


export function ensureTeamPlayers(team) {
    if (!team?.roster) return;
    team.roster.forEach(ensurePlayerStats);
}


// ===============================
// INTERNAL HELPERS
// ===============================

function randomRating() {
    const roll = Math.random();

    // most players are average
    if (roll < 0.70) return randomInt(60, 80);

    // some are good
    if (roll < 0.92) return randomInt(81, 90);

    // a few are stars
    return randomInt(91, 99);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateName() {
    const first = [
        "Liam", "Noah", "Mason", "Lucas", "Ethan",
        "Aiden", "Thomas", "Ryan", "Matthew", "Sam",
        "Ivan", "Connor", "Nathan", "Cole", "Tyler",
        "Owen", "Carter", "Dylan", "Hunter", "Logan"
    ];

    const last = [
        "Smith", "Clarke", "Martin", "Roy", "Dubois",
        "Harris", "Gagnon", "Brooks", "Fisher", "Stone",
        "Hart", "Lindsay", "Vachon", "Mercer", "Walsh",
        "Keller", "Reed", "Thornton", "Holt", "Bennett"
    ];

    return `${randomPick(first)} ${randomPick(last)}`;
}


function vary(base) {
    const variation = randomInt(-5, 5);
    return clamp(base + variation, 50, 99);
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}
