// leagueState.js

import {
    createInitialLeague
}
from "../data/createTeams.js";



export const leagueState = {

    currentDate: {
        year: 1960,
        month: 10,
        day: 1
    },

    settings: {

        hardcodedExpansion: true
    },

    league: {

        name: "National Professional Hockey League",

        teams: createInitialLeague(),

        standings: []
    }
};