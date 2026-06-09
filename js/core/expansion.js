// expansion.js

export const expansionEvents = [

    {
        year: 1967,
        teams: [
            "Pittsburgh",
            "Los Angeles",
            "Edmonton", 
            "Minnesota", 
        ]
    },

    {
        year: 1974,
        teams: [
            "Calgary",
            "Vancouver", 
            "Buffalo", 
            "New Jersey"

        ]
    }
];


export function checkExpansion(userTeam, opponents, currentDate) {

    if (!currentDate) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    // only run once: June 1
    if (month !== 5 || day !== 1) return;

    expansionEvents.forEach(event => {

        if (event.year === year && !event.triggered) {

            let expanded = false;

            event.teams.forEach(teamName => {

                const alreadyExists =
                    userTeam.name === teamName ||
                    opponents.some(t => t.name === teamName);

                if (alreadyExists) return;

                opponents.push({
                    name: teamName,
                    roster: [],
                    lineup: [],
                    wins: 0,
                    losses: 0
                });

                expanded = true;

                console.log(`${teamName} joined the league!`);
            });

            if (expanded) {
                const teamNames = [userTeam.name, ...opponents.map(t => t.name)];
                generateSchedule(teamNames, currentDate);
            }

            event.triggered = true;
        }
    });
}