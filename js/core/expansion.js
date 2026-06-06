// expansion.js

export const expansionEvents = [

    {
        year: 1967,

        teams: [
            "Philadelphia Flyers",
            "Pittsburgh Penguins",
            "St. Louis Blues"
        ]
    },

    {
        year: 1970,

        teams: [
            "Buffalo Sabres",
            "Vancouver Canucks"
        ]
    }
];




export function checkExpansion(state) {

    if (!state.settings.hardcodedExpansion) {
        return;
    }

    expansionEvents.forEach(event => {

        if (
            event.year ===
            state.currentDate.year
        ) {

            event.teams.forEach(team => {

                state.league.teams.push({
                    name: team,
                    wins: 0,
                    losses: 0
                });

                console.log(
                    `${team} joined the league!`
                );
            });
        }
    });
}