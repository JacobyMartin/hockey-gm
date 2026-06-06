// createTeams.js

import {
    originalTeams
}
from "./teams.js";

import {
    rosters1960
}
from "./rosters/1960.js";

export function createInitialLeague() {

    return originalTeams.map(teamName => {

        return {

            name: teamName,

            wins: 0,
            losses: 0,

            lineup:
                rosters1960[teamName] || []
        };
    });
}
