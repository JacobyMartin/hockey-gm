// engine.js
//season simulation, game flow, etc


import {
    simulateMatch
} from "./simulation.js";

export function playGame(userTeam, opponent) {

    const result = simulateMatch(userTeam, opponent);
    return result;
}

export function simulateSeason(userTeam, opponents) {

    const seasonResults = [];

    opponents.forEach(team => {

        const result =
            playGame(userTeam, team);

        seasonResults.push(result);
    });

    return seasonResults;
}
