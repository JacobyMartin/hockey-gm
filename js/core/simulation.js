// simulation.js

import { getTeamOverall } from "./stats.js";
import { buildRosterLines } from "../utils/rosterUtils.js";

const POSSESSIONS = 42;   
const BASE_GOAL_CHANCE = 0.08;   // tune this up/down for league scoring

export function simulateMatch(homeTeam, awayTeam) {
    const homeOverall = getTeamOverall(homeTeam);
    const awayOverall = getTeamOverall(awayTeam);

    let homeGoals = 0;
    let awayGoals = 0;

    const events = [];

    const homeGoalChance = BASE_GOAL_CHANCE * (homeOverall / 80);
    const awayGoalChance = BASE_GOAL_CHANCE * (awayOverall / 80);

    for (let i = 0; i < POSSESSIONS; i++) {
        if (Math.random() < homeGoalChance) {
            homeGoals++;
            events.push(createGoalEvent(homeTeam, "home"));
        }

        if (Math.random() < awayGoalChance) {
            awayGoals++;
            events.push(createGoalEvent(awayTeam, "away"));
        }
    }

    // optional overtime/shootout prevention if you never want ties
    if (homeGoals === awayGoals) {
        if (Math.random() < 0.5) {
            homeGoals++;
            events.push(createGoalEvent(homeTeam, "home"));
        } else {
            awayGoals++;
            events.push(createGoalEvent(awayTeam, "away"));
        }
    }

    return {
        homeGoals,
        awayGoals,
        winner: homeGoals > awayGoals ? homeTeam.name : awayTeam.name,
        events
    };
}


// ===============================
// HELPERS
// ===============================

function createGoalEvent(team, side) {
    const activeSkaters = getActiveSkaters(team);

    if (activeSkaters.length === 0) {
        return {
            team: team.name,
            side,
            scorer: null,
            assist: null,
            secondAssist: null
        };
    }

    // scorer heavily weighted by line + shooting + offenseIQ
    const scorerEntry = weightedPick(activeSkaters, getScoringWeight);
    const scorer = scorerEntry.player;

    // assist pool excludes scorer
    const assistPool = activeSkaters.filter(entry => entry.player !== scorer);

    let assist = null;
    let secondAssist = null;

    if (assistPool.length > 0) {
        const assistEntry = weightedPick(assistPool, getAssistWeight);
        assist = assistEntry.player;

        // optional second assist ~45% of the time
        const secondAssistPool = assistPool.filter(entry => entry.player !== assist);

        if (secondAssistPool.length > 0 && Math.random() < 0.45) {
            const secondAssistEntry = weightedPick(secondAssistPool, getAssistWeight);
            secondAssist = secondAssistEntry.player;
        }
    }

    return {
        team: team.name,
        side,
        scorer,
        assist,
        secondAssist
    };
}

function getActiveSkaters(team) {
    if (!team?.roster) return [];

    const { lines } = buildRosterLines(team.roster);

    // add line metadata so we can weight by line
    return lines.flatMap((line, index) =>
        line.players
            .filter(player => player && player.pos !== "G")
            .map(player => ({
                player,
                lineIndex: index + 1,
                lineName: line.name
            }))
    );
}

function getLineMultiplier(lineIndex) {
    if (lineIndex === 1) return 1.65; // first line dominates
    if (lineIndex === 2) return 1.05; // second line still strong
    if (lineIndex === 3) return 0.60; // third line depth scoring
    return 1.0;
}

function getScoringWeight(entry) {
    const player = entry.player;

    const shooting = player.shooting || 0;
    const offenseIQ = player.offenseIQ || 0;

    const lineBonus = getLineMultiplier(entry.lineIndex);

    // defense scores less than forwards
    const positionBonus = player.pos === "D" ? 0.65 : 1.20;

    return Math.max(
        1,
        (shooting * 0.60 + offenseIQ * 0.40) * lineBonus * positionBonus
    );
}

function getAssistWeight(entry) {
    const player = entry.player;

    const passing = player.passing || 0;
    const offenseIQ = player.offenseIQ || 0;

    const lineBonus = getLineMultiplier(entry.lineIndex);

    // defense can still collect assists fairly often
    const positionBonus = player.pos === "D" ? 0.95 : 1.10;

    return Math.max(
        1,
        (passing * 0.60 + offenseIQ * 0.40) * lineBonus * positionBonus
    );
}

function weightedPick(entries, weightFn) {
    const weighted = entries.map(entry => ({
        entry,
        weight: Math.max(1, weightFn(entry))
    }));

    const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);

    let roll = Math.random() * totalWeight;

    for (const item of weighted) {
        roll -= item.weight;
        if (roll <= 0) {
            return item.entry;
        }
    }

    return weighted[weighted.length - 1].entry;
}