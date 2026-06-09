// simulation.js
// simulate matches based on team ratings

import {
    getTeamOverall
} from "./stats.js";

export function simulateMatch(homeTeam, awayTeam) {

    const homeOverall = getTeamOverall(homeTeam);
    const awayOverall = getTeamOverall(awayTeam);

    let homeGoals = 0;
    let awayGoals = 0;

    const events = []; // track goals

    // simulate possessions
    for (let i = 0; i < 30; i++) {

        const homeChance = Math.random() * homeOverall;
        const awayChance = Math.random() * awayOverall;

        // home goal
        if (homeChance > 75) {
            homeGoals++;

            const event = createGoalEvent(homeTeam, awayTeam, "home");
            events.push(event);
        }

        // away goal
        if (awayChance > 75) {
            awayGoals++;

            const event = createGoalEvent(homeTeam, awayTeam, "away");
            events.push(event);
        }
    }

    return {
        homeGoals,
        awayGoals,
        winner:
            homeGoals > awayGoals
                ? homeTeam.name
                : awayTeam.name,
        events
    };
}




// HELPER

function createGoalEvent(homeTeam, awayTeam, side) {

    const team = side === "home" ? homeTeam : awayTeam;

    const players = team.lineup || [];

    if (players.length === 0) {
        return { team: team.name, scorer: null, assist: null };
    }

    // pick scorer
    const scorer = players[Math.floor(Math.random() * players.length)];

    // pick assist (not the same player)
    let assist = players[Math.floor(Math.random() * players.length)];

    if (assist === scorer) assist = null;

    return {
        team: team.name,
        scorer,
        assist
    };
}