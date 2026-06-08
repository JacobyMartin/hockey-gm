// main.js
console.log("main.js loaded");


import { playGame, simulateSeason } from "./core/engine.js";
import { buildBestLineup } from "./rosterUtils.js";
import { setDate } from "./core/calendar.js";

import {
    getCurrentDate,
    advanceDay,
    advanceDays,
    formatDate
} from "./core/calendar.js";


import {
    renderLineup,
    renderRoster,
    renderStandings,
    updateRecord,
    updateGameResult
} from "./ui/dashboard.js";

import { rosters1960 } from "./data/rosters/1960.js"; 


// ===== SAVE / LOAD =====

function saveGame() {
    localStorage.setItem("hockeyGM_save", JSON.stringify({
        userTeam,
        opponents, 
        date: getCurrentDate()
    }));
}

function loadGame() {
    const save = localStorage.getItem("hockeyGM_save");

    if (!save) return false;

    const data = JSON.parse(save);

    userTeam = data.userTeam;
    opponents = data.opponents;

    if (data.date) {
        setDate(new Date(data.date));
    }

    if (!userTeam || !opponents) return false;

    return true;
}




// ===============================
// STATE
// ===============================

let userTeam = null;
let opponents = [];
let gameIndex = 0;


// ===============================
// INIT
// ===============================

function init() {

    window.renderRoster = renderRoster;
    window.renderStandings = renderStandings;
    window.updateRecord = updateRecord;
    if (loadGame()) {

        console.log("Loaded saved game");

        // make data global
        window.userTeam = userTeam;
        window.opponents = opponents;

        // update header
        document.getElementById("teamName").textContent = userTeam.name;
        document.getElementById("currentDate").textContent = formatDate(getCurrentDate());
        // render
        renderLineup(userTeam.lineup);
        renderRoster(userTeam.roster);
        renderStandings(getStandings(), userTeam.name);
        updateRecord(userTeam);
        updateDateUI();

        document.getElementById("startScreen").style.display = "none";

        showScreen("dashboard");

    }
    
    if (!userTeam) {
        populateTeamSelector();
    }
}


// ===============================
// TEAM SELECTOR
// ===============================

function populateTeamSelector() {
    const select = document.getElementById("teamSelect");
    select.innerHTML = "";

    Object.keys(rosters1960).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}
// ===============================
// LINEUP FOR DASHBOARD
// ===============================
function calculateOVR(player) {
    if (!player) return 0;

    if (player.pos === "G") {
        return Math.round(
            ((player.reflexes || 0) + (player.positioning || 0) + (player.puckControl || 0)) / 3
        );
    }

    return Math.round(
        ((player.shooting || 0) + (player.passing || 0) + (player.offenseIQ || 0) + (player.defense || 0)) / 4
    );
}

/// ===============================
//LINEUP FOR ROSTER SCREEN
/// ===============================

function buildRosterLines(players) {

    // split by position
    let forwards = players.filter(p => p.pos === "C" || p.pos === "LW" || p.pos === "RW");
    let defense = players.filter(p => p.pos === "D");
    let goalies = players.filter(p => p.pos === "G");

    // apply limits
    forwards = forwards.slice(0, 9);
    defense = defense.slice(0, 5);
    goalies = goalies.slice(0, 2);

    // build lineup groups
    const lines = [];

    // first line (same as dashboard)
    lines.push({
        name: "Line 1",
        players: [
            ...forwards.slice(0, 3),
            ...defense.slice(0, 2),
            goalies[0]
        ]
    });

    // second line (if enough players)
    if (forwards.length >= 6 || defense.length >= 4) {
        lines.push({
            name: "Line 2",
            players: [
                ...forwards.slice(3, 6),
                ...defense.slice(2, 4),
                goalies[1] || null
            ].filter(Boolean)
        });
    }

    // scratches 
    const used = new Set(lines.flatMap(l => l.players.map(p => p.id)));

    const scratches = players.filter(p => !used.has(p.id));

    return {
        lines,
        scratches
    };
}


// ===============================
// START GAME
// ===============================

window.startGame = function () {
    const selected = document.getElementById("teamSelect").value;
    const selectedRoster = rosters1960[selected];

    if (!Array.isArray(selectedRoster)) {
        console.error("Selected team roster is missing or invalid:", selected, selectedRoster);
        return;
    }

    userTeam = {
        name: selected,
        roster: selectedRoster,
        lineup: buildBestLineup(selectedRoster),
        wins: 0,
        losses: 0
    };

    opponents = Object.keys(rosters1960)
        .filter(name => name !== selected)
        .map(name => {
            const roster = rosters1960[name];

            if (!Array.isArray(roster)) {
                console.error("Opponent roster is missing:", name, roster);
                return null;
            }

            return {
                name,
                roster,
                lineup: buildBestLineup(roster),
                wins: 0,
                losses: 0
            };
        })
        .filter(Boolean);

    document.getElementById("teamName").textContent = userTeam.name;

    renderLineup(userTeam.lineup);
    renderRoster(userTeam.roster);
    updateRecord(userTeam.wins, userTeam.losses);
    document.getElementById("startScreen").style.display = "none";


    window.getStandings = getStandings;
    window.userTeam = userTeam;
    window.opponents = opponents;


    showScreen("dashboard");
    saveGame();
};


// ===============================
// GAME ACTIONS
// ===============================


function updateDateUI() {
    document.getElementById("currentDate").textContent =
        formatDate(getCurrentDate());
}

window.simDay = function () {

    if (!userTeam) return;

    advanceDay();

    // play one game
    const opponent = getNextOpponent();
    const result = playGame(userTeam, opponent);

    applyGameResult(result, opponent);
    updateGameResult(result);

    updateDateUI();

    saveGame();
};


window.simWeek = function () {

    if (!userTeam) return;

    for (let i = 0; i < 7; i++) {

        advanceDay();

        const opponent = getNextOpponent();
        const result = playGame(userTeam, opponent);

        applyGameResult(result, opponent);
    }

    updateDateUI();
    saveGame();
};




// ===============================
// HELPERS
// ===============================

function getStandings() {
    return [userTeam, ...opponents]
        .sort((a, b) => b.wins - a.wins);
}

function getNextOpponent() {
    const opponent = opponents[gameIndex % opponents.length];
    gameIndex++;
    return opponent;
}

function applyGameResult(result, opponent) {

    if (result.winner === userTeam.name) {
        userTeam.wins++;
        opponent.losses++;
    } else {
        userTeam.losses++;
        opponent.wins++;
    }

    updateRecord(userTeam.wins, userTeam.losses);
}



// ===============================
// GLOBAL BUTTONS
// ===============================

window.simDay = simDay;
window.simWeek = simWeek;
window.getStandings = getStandings;

window.resetGame = function () {
    localStorage.removeItem("hockeyGM_save");
    location.reload();
};


// ===============================
// START
// ===============================

init();