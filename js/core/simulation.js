// simulation.js
// simulate matches based on team ratings

import { getTeamOverall } from "./stats.js";
import { buildRosterLines } from "../utils/rosterUtils.js";

export function simulateMatch(homeTeam, awayTeam) {
    const homeOverall = getTeamOverall(homeTeam);
    const awayOverall = getTeamOverall(awayTeam);

    let homeGoals = 0;
    let awayGoals = 0;

    const events = [];

    // simulate possessions / chances
    for (let i = 0; i < 30; i++) {
        const homeChance = Math.random() * homeOverall;
        const awayChance = Math.random() * awayOverall;

        // home goal
        if (homeChance > 75) {
            homeGoals++;
            events.push(createGoalEvent(homeTeam, "home"));
        }

        // away goal
        if (awayChance > 75) {
            awayGoals++;
            events.push(createGoalEvent(awayTeam, "away"));
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


// ===============================
// HELPERS
// ===============================

function createGoalEvent(team, side) {
    const skaters = getActiveSkaters(team);

    if (skaters.length === 0) {
        return {
            team: team.name,
            side,
            scorer: null,
            assist: null
        };
    }

    const scorer = weightedPick(skaters, player => getScoringWeight(player));

    // assister can be anyone active except scorer
    const assistPool = skaters.filter(player => player !== scorer);

    const assist =
        assistPool.length > 0
            ? weightedPick(assistPool, player => getAssistWeight(player))
            : null;

    return {
        team: team.name,
        side,
        scorer,
        assist
    };
}

function getActiveSkaters(team) {
    if (!team?.roster) return [];

    const { lines } = buildRosterLines(team.roster);

    //skaters only
    //goalies and scratches are excluded
    return lines
        .flatMap(line => line.players)
        .filter(player => player && player.pos !== "G");
}

function getScoringWeight(player) {
    const shooting = player.shooting || 0;
    const offenseIQ = player.offenseIQ || 0;

    // forwards should score more than defense
    const positionBonus =
        player.pos === "D" ? 0.55 : 1.05;

    // weighted toward shooters/offensive players
    return Math.max(
        1,
        (shooting * 0.65 + offenseIQ * 0.35) * positionBonus
    );
}

function getAssistWeight(player) {
    const passing = player.passing || 0;
    const offenseIQ = player.offenseIQ || 0;

    // defense can still assist often, just score less
    const positionBonus =
        player.pos === "D" ? 0.75 : 1.05;

    return Math.max(
        1,
        (passing * 0.65 + offenseIQ * 0.35) * positionBonus
    );
}

function weightedPick(players, weightFn) {
    const weighted = players.map(player => ({
        player,
        weight: Math.max(1, weightFn(player))
    }));

    const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);

    let roll = Math.random() * totalWeight;

    for (const item of weighted) {
        roll -= item.weight;
        if (roll <= 0) {
            return item.player;
        }
    }

    return weighted[weighted.length - 1].player;
}