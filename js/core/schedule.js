// js/core/schedule.js

let schedule = {};

/**
 * Convert a Date to YYYY-MM-DD
 */
function formatScheduleKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * Generate a simple league schedule
 * Each team plays every other team 4 times
 */
export function generateSchedule(teamNames, startDate = new Date(1960, 9, 5)) {

    schedule = {};

    const MAX_GAMES = 78;

    // track games played per team
    const gamesPlayed = {};
    teamNames.forEach(team => {
        gamesPlayed[team] = 0;
    });

    let currentDate = new Date(startDate);

    function hasRemainingGames() {
        return teamNames.some(team => gamesPlayed[team] < MAX_GAMES);
    }

    while (hasRemainingGames()) {

        const dateKey = formatScheduleKey(currentDate);

        if (!schedule[dateKey]) {
            schedule[dateKey] = [];
        }

        // find teams still needing games
        const availableTeams = teamNames.filter(
            t => gamesPlayed[t] < MAX_GAMES
        );

        // shuffle them randomly
        const shuffled = [...availableTeams].sort(() => Math.random() - 0.5);

        for (let i = 0; i < shuffled.length - 1; i += 2) {

            const home = shuffled[i];
            const away = shuffled[i + 1];

            // skip if either already finished
            if (
                gamesPlayed[home] >= MAX_GAMES ||
                gamesPlayed[away] >= MAX_GAMES
            ) continue;

            schedule[dateKey].push({ home, away });

            gamesPlayed[home]++;
            gamesPlayed[away]++;
        }
        
        if (shuffled.length % 2 !== 0) {
            shuffled.pop(); // remove last team for that day
        }


        // move to next day
        // randomly add 1–3 days between game sets
        const gap = Math.floor(Math.random() * 3) + 1; 
        currentDate.setDate(currentDate.getDate() + gap);


        // safety stop (Apr 10 cutoff)
        const seasonEnd = new Date(startDate.getFullYear() + 1, 3, 10);
        if (currentDate > seasonEnd) break;
    }

    return schedule;
}

/**
 * Get all games on a date
 */
export function getGamesForDate(date) {
    const key = formatScheduleKey(date);
    return schedule[key] || [];
}

/**
 * Get one specific team's game for a date
 */
export function getTeamGameForDate(teamName, date) {
    const games = getGamesForDate(date);

    return games.find(
        game => game.home === teamName || game.away === teamName
    ) || null;
}

/**
 * Get opponent for a team on a given date
 */
export function getOpponentForDate(teamName, date) {
    const game = getTeamGameForDate(teamName, date);

    if (!game) return null;

    return game.home === teamName ? game.away : game.home;
}

/**
 * Save schedule
 */
export function serializeSchedule() {
    return schedule;
}

/**
 * Load schedule from save
 */
export function loadSchedule(savedSchedule) {
    schedule = savedSchedule || {};
}