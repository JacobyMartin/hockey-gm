// main.js

import {
    playGame,
    simulateSeason
} from "./core/engine.js";


import {
    renderLineup,
    updateRecord,
    updateGameResult
}
from "./ui/dashboard.js";


const userTeam = {
    name: "Belleville Blades",
    wins: 0,
    losses: 0,

    lineup: [

        {
            name: "Crosby",
            pos: "C",

            shooting: 90,
            passing: 95,
            offenseIQ: 97,

            defense: 80,
            defenseIQ: 88
        },

        {
            name: "McDavid",
            pos: "LW",

            shooting: 96,
            passing: 99,
            offenseIQ: 99,

            defense: 75,
            defenseIQ: 82
        },

        {
            name: "Makar",
            pos: "D",

            shooting: 88,
            passing: 92,
            offenseIQ: 90,

            defense: 95,
            defenseIQ: 94
        },

        {
            name: "Goalie",
            pos: "G",

            reflexes: 92,
            positioning: 90,
            puckControl: 88
        }
    ]
};

const opponents = [

    {
        name: "Toronto",
        lineup: userTeam.lineup
    },

    {
        name: "Montreal",
        lineup: userTeam.lineup
    }
];

window.simNextGame = function () {

    const result =
        playGame(userTeam, opponents[0]);

    console.log(result);
};

window.simSeason = function () {

    const results =
        simulateSeason(userTeam, opponents);

    console.log(results);
};