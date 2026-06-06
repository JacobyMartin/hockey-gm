// stats.js
//ratings, overall calculations

export function getPlayerOffense(player) {
    return (
        player.shooting * 0.5 +
        player.passing * 0.3 +
        player.offenseIQ * 0.2
    );
}

export function getPlayerDefense(player) {
    return (
        player.defense * 0.6 +
        player.defenseIQ * 0.4
    );
}

export function getGoalieRating(goalie) {
    return (
        goalie.reflexes * 0.5 +
        goalie.positioning * 0.3 +
        goalie.puckControl * 0.2
    );
}

export function getTeamOverall(team) {

    let total = 0;

    team.lineup.forEach(player => {

        if (player.pos === "G") {
            total += getGoalieRating(player);
        } else {
            total += (
                getPlayerOffense(player) +
                getPlayerDefense(player)
            ) / 2;
        }
    });

    return Math.round(total / team.lineup.length);
}