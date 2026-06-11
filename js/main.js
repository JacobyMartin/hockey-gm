// main.js
console.log("main.js loaded");


import { playGame} from "./core/engine.js";
import { buildBestLineup, buildRosterLines } from "./utils/rosterUtils.js";
import { createTeam} from "./utils/playerUtils.js";
import { checkExpansion } from "./core/expansion.js";

import {
    getCurrentDate,
    advanceDay,
    advanceDays,
    setDate,
    formatDate
} from "./core/calendar.js";


import {
    generateSchedule,
    getTeamGameForDate,
    getGamesForDate,
    getOpponentForDate,
    loadSchedule,
    serializeSchedule
} from "./core/schedule.js";



import {
    renderLineup,
    renderRoster,
    renderStandings,
    renderCalendar,
    updateRecord,
    updateGameResult,
    closePlayerModal
} from "./ui/dashboard.js";

import { originalTeams } from "./data/teams.js"; 
import { simulateMatch } from "./core/simulation.js";


// ===== SAVE / LOAD =====

function saveGame() {
    localStorage.setItem("hockeyGM_save", JSON.stringify({
        userTeam,
        opponents, 
        date: getCurrentDate(),
        schedule: serializeSchedule()
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

    if (data.schedule) {
        loadSchedule(data.schedule);
    }

    if (!userTeam || !opponents) return false;

    return true;
}




// ===============================
// STATE
// ===============================

let userTeam = null;
let opponents = []; 

// ===============================
// INIT
// ===============================

function init() {
    window.renderRoster = renderRoster;
    window.renderStandings = renderStandings;
    window.renderCalendar = renderCalendar;
    window.updateRecord = updateRecord;
    window.getTeamGameForDate = getTeamGameForDate;
    window.getCurrentDate = getCurrentDate; 
    window.calendarViewDate = new Date();
    window.renderCalendarViewDate = renderCalendarView;
    window.closePlayerModal = closePlayerModal;

        if (loadGame()) {
        console.log("Loaded saved game");

        // expose globals
        window.userTeam = userTeam;
        window.opponents = opponents;

        // restore header
        document.getElementById("teamName").textContent = userTeam.name;

        // restore date UI
        updateDateUI();

        //rebuild lineup after load
        userTeam.lineup = buildBestLineup(userTeam.roster);
        
        opponents.forEach(team => {
            team.lineup = buildBestLineup(team.roster);
        });
        
        // restore main UI
        renderLineup(userTeam.lineup);
        renderRoster(userTeam.roster);
        renderStandings(getStandings(), userTeam.name);

        updateRecord(userTeam);

        // hide start screen
        document.getElementById("startScreen").style.display = "none";

        // initialize calendar state (IMPORTANT)
        window.calendarViewDate = new Date(getCurrentDate());
        updateTodayMatchup();

        // default screen AFTER load
        showScreen("dashboard");

        return; // VERY IMPORTANT (prevents selector from showing)
        }
        else {
            populateTeamSelector();
        }
}


// ===============================
// TEAM SELECTOR
// ===============================


function populateTeamSelector() {

    const select = document.getElementById("teamSelect");
    select.innerHTML = "";

    
    originalTeams.forEach(team => {
        const option = document.createElement("option");

        // supports BOTH object + string formats
        const name = typeof team === "string" ? team : team.name;

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



// ===============================
// START GAME
// ===============================

window.startGame = function () {

    const teamNames = originalTeams.map(team =>
        typeof team === "string" ? team : team.name
    );

    const selectedTeamName = document.getElementById("teamSelect").value;


    //build randomly generated teams 
    userTeam = createTeam(selectedTeamName,{
        easterEggChance: 0.5 //must change later 
    }); 

    
    
    opponents = teamNames
        .filter(name => name !== selectedTeamName)
        .map(name => createTeam(name));



    //set game start date. 
    setDate(new Date(1960, 9, 1));

    //build lineup for dashboard
    userTeam.lineup = buildBestLineup(userTeam.roster);

    opponents.forEach(team => {
        team.lineup = buildBestLineup(team.roster);
    });

    // generate schedule
    const scheduleTeamNames = [userTeam.name, ...opponents.map(t => t.name)];
    generateSchedule(scheduleTeamNames, getCurrentDate());

    //update ui
    document.getElementById("teamName").textContent = userTeam.name;

    renderLineup(userTeam.lineup);
    renderRoster(userTeam.roster);
    renderStandings(getStandings(), userTeam.name);
    updateRecord(userTeam);
    updateDateUI();
    updateTodayMatchup();

    document.getElementById("startScreen").style.display = "none";

    window.getStandings = getStandings;
    window.userTeam = userTeam;
    window.opponents = opponents;

    if (typeof renderCalendar === "function") {
        renderCalendar();
    }

    //dashboard view default screen 
    showScreen("dashboard");
    
    window.calendarViewDate = new Date(getCurrentDate());
    renderCalendarView();

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

    const currentDate = getCurrentDate();

    const gamesToday = getGamesForDate(currentDate);

    let userGameResult = null;

    gamesToday.forEach(game => {

        const homeTeam = getTeamByName(game.home);
        const awayTeam = getTeamByName(game.away);

        if (!homeTeam || !awayTeam) return;

        const result = simulateMatch(homeTeam, awayTeam);
        applyPlayerStats(result.events);
            
        addGamesPlayed(homeTeam);
        addGamesPlayed(awayTeam);

        applyGameResult(result, homeTeam, awayTeam);


        // track user game
        if (
            game.home === userTeam.name ||
            game.away === userTeam.name
        ) {
            userGameResult = result;
        }
    });

    // update UI
    if (userGameResult) {
        updateGameResult(userGameResult);
    } else {
        document.getElementById("gameResult").textContent = "No game today";
    }

    advanceDay();
    updateDateUI();
    updateTodayMatchup();
    renderStandings(getStandings(), userTeam.name);
    renderLineup(userTeam.lineup);
    renderRoster(userTeam.roster);
    saveGame();
};


window.simWeek = function () {

    if (!userTeam) return;

    let lastUserResult = null;

    for (let i = 0; i < 7; i++) {

        const currentDate = getCurrentDate();
        const gamesToday = getGamesForDate(currentDate);

        gamesToday.forEach(game => {

            const homeTeam = getTeamByName(game.home);
            const awayTeam = getTeamByName(game.away);

            if (!homeTeam || !awayTeam) return;

            const result = simulateMatch(homeTeam, awayTeam);
            applyPlayerStats(result.events);
            
            addGamesPlayed(homeTeam);
            addGamesPlayed(awayTeam);

            applyGameResult(result, homeTeam, awayTeam);

            if (
                game.home === userTeam.name || game.away === userTeam.name) 
                    {
                        lastUserResult = result;
                    }
        });

        advanceDay();
    }

    if (lastUserResult) {
        updateGameResult(lastUserResult);
    } else {
        document.getElementById("gameResult").textContent = "No games this week";
    }

    updateDateUI();
    updateTodayMatchup();
    renderStandings(getStandings(), userTeam.name);
    renderLineup(userTeam.lineup);
    renderRoster(userTeam.roster);
    saveGame();
};




// ===============================
// HELPERS
// ===============================

function getStandings() {
    return [userTeam, ...opponents]
        .sort((a, b) => b.wins - a.wins);
}


function applyGameResult(result, homeTeam, awayTeam) {

    if (result.winner === homeTeam.name) {
        homeTeam.wins++;
        awayTeam.losses++;
    } else {
        awayTeam.wins++;
        homeTeam.losses++;
    }
}


function renderCalendarView() {

    if (!userTeam) return;

    const label = document.getElementById("calendarMonth");

    if (label) {
        label.textContent = window.calendarViewDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });
    }

    renderCalendar(
        window.calendarViewDate,
        getTeamGameForDate,
        userTeam.name
    );
}


window.nextMonth = function () {
    window.calendarViewDate.setMonth(window.calendarViewDate.getMonth() + 1);
    renderCalendarView();
};

window.prevMonth = function () {
    window.calendarViewDate.setMonth(window.calendarViewDate.getMonth() - 1);
    renderCalendarView();
};


window.renderCalendarView = renderCalendarView;
window.getTeamGameForDate = getTeamGameForDate;
window.getCurrentDate = getCurrentDate;



function updateTodayMatchup() {
    const el = document.getElementById("todayMatchup");
    if (!el || !userTeam) return;

    const game = getTeamGameForDate(userTeam.name, getCurrentDate());

    if (!game) {
        el.textContent = "No game today";
        return;
    }

    const isHome = game.home === userTeam.name;
    const opponent = isHome ? game.away : game.home;

    el.textContent = isHome ? `vs ${opponent}` : `@ ${opponent}`;
}


function getTeamByName(name) {
    if (userTeam.name === name) return userTeam;

    return opponents.find(t => t.name === name);
}


function ensureStats(player) {
    if (!player.careerStats) {
        player.careerStats = { games: 0, goals: 0, assists: 0, points: 0 };
    }

    if (!player.currentSeasonStats) {
        player.currentSeasonStats = { games: 0, goals: 0, assists: 0, points: 0 };
    }
}

function ensurePlayerHasStats(player) {
    if (!player.careerStats) {
        player.careerStats = {
            games: 0,
            goals: 0,
            assists: 0,
            points: 0
        };
    }

    if (!player.currentSeasonStats) {
        player.currentSeasonStats = {
            games: 0,
            goals: 0,
            assists: 0,
            points: 0
        };
    }
}

function initializeTeamStats(team) {
    if (!team?.roster) return;

    team.roster.forEach(player => {
        ensurePlayerHasStats(player);
    });
}




function applyPlayerStats(events) {
    if (!events) return;

    events.forEach(event => {
        if (event.scorer) {
            ensureStats(event.scorer);

            event.scorer.careerStats.goals++;
            event.scorer.careerStats.points++;

            event.scorer.currentSeasonStats.goals++;
            event.scorer.currentSeasonStats.points++;
        }

        if (event.assist) {
            ensureStats(event.assist);

            event.assist.careerStats.assists++;
            event.assist.careerStats.points++;

            event.assist.currentSeasonStats.assists++;
            event.assist.currentSeasonStats.points++;
        }

        if (event.secondAssist) {
            ensureStats(event.secondAssist);

            event.secondAssist.careerStats.assists++;
            event.secondAssist.careerStats.points++;

            event.secondAssist.currentSeasonStats.assists++;
            event.secondAssist.currentSeasonStats.points++;
        }
    });
}



function addGamesPlayed(team) {
    if (!team?.roster) return;

    const { lines } = buildRosterLines(team.roster);

    const activePlayers = lines.flatMap(line => line.players);

    activePlayers.forEach(player => {
        ensureStats(player);
        player.careerStats.games++;
        player.currentSeasonStats.games++;
    });
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

document.addEventListener("DOMContentLoaded", () => {
    init();
});
