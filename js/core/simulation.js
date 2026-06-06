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

    // Simulate 30 possessions
    for (let i = 0; i < 30; i++) {

        const homeChance =
            Math.random() * homeOverall;

        const awayChance =
            Math.random() * awayOverall;

        if (homeChance > 75) {
            homeGoals++;
        }

        if (awayChance > 75) {
            awayGoals++;
        }
    }

    return {
        homeGoals,
        awayGoals,
        winner:
            homeGoals > awayGoals
                ? homeTeam.name
                : awayTeam.name
    };
}