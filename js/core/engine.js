// engine.js
//season simulation, game flow, etc


import {
    simulateMatch
} from "./simulation.js";

export function playGame(userTeam, opponent) {

    const result =
        simulateMatch(userTeam, opponent);

    if (
        result.winner === userTeam.name
    ) {
        userTeam.wins++;
    } else {
        userTeam.losses++;
    }

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