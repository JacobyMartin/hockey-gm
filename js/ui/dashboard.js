// dashboard.js
import { buildRosterLines, calculateOVR } from "../utils/rosterUtils.js";


// ===============================
// HELPERS
// ===============================
function getSeasonStats(player) {
    return player.currentSeasonStats || {
        games: 0,
        goals: 0,
        assists: 0,
        points: 0
    };
}

function getCareerStats(player) {
    return player.careerStats || {
        games: 0,
        goals: 0,
        assists: 0,
        points: 0
    };
}


// ===============================
// PLAYER DETAIL MODAL
// ===============================
export function showPlayerDetails(player) {
    if (!player) return;

    const season = getSeasonStats(player);
    const career = getCareerStats(player);

    const modal = document.getElementById("playerModal");
    if (!modal) return;

    const nameEl = document.getElementById("playerModalName");
    const profileEl = document.getElementById("playerProfile");
    const attrsEl = document.getElementById("playerAttributes");
    const seasonEl = document.getElementById("playerSeasonStats");
    const careerEl = document.getElementById("playerCareerStats");

    if (nameEl) {
        nameEl.textContent = player.name;
    }

    if (profileEl) {
        profileEl.innerHTML = `
            <div class="player-stat-grid">
                <div class="player-stat-row">
                    <span class="player-stat-label">Position</span>
                    <span class="player-stat-value">${player.pos ?? "-"}</span>
                </div>
                <div class="player-stat-row">
                    <span class="player-stat-label">Age</span>
                    <span class="player-stat-value">${player.age ?? "-"}</span>
                </div>
                <div class="player-stat-row">
                    <span class="player-stat-label">OVR</span>
                    <span class="player-stat-value">${calculateOVR(player)}</span>
                </div>
            </div>
        `;
    }

    if (attrsEl) {
        if (player.pos === "G") {
            attrsEl.innerHTML = `
                <div class="player-stat-grid">
                    <div class="player-stat-row">
                        <span class="player-stat-label">Reflexes</span>
                        <span class="player-stat-value">${player.reflexes ?? 0}</span>
                    </div>
                    <div class="player-stat-row">
                        <span class="player-stat-label">Positioning</span>
                        <span class="player-stat-value">${player.positioning ?? 0}</span>
                    </div>
                    <div class="player-stat-row">
                        <span class="player-stat-label">Puck Control</span>
                        <span class="player-stat-value">${player.puckControl ?? 0}</span>
                    </div>
                    <div class="player-stat-row">
                        <span class="player-stat-label">Rebound Control</span>
                        <span class="player-stat-value">${player.reboundControl ?? 0}</span>
                    </div>
                    <div class="player-stat-row">
                        <span class="player-stat-label">Goalie IQ</span>
                        <span class="player-stat-value">${player.goalieIQ ?? 0}</span>
                    </div>
                </div>
            `;
        } else {
            attrsEl.innerHTML = `
                <div class="player-stat-grid">
                    <div class="player-stat-row">
                        <span class="player-stat-label">Shooting</span>
                        <span class="player-stat-value">${player.shooting ?? 0}</span>
                    </div>
                    <div class="player-stat-row">
                        <span class="player-stat-label">Passing</span>
                        <span class="player-stat-value">${player.passing ?? 0}</span>
                    </div>
                    <div class="player-stat-row">
                        <span class="player-stat-label">Offense IQ</span>
                        <span class="player-stat-value">${player.offenseIQ ?? 0}</span>
                    </div>
                    <div class="player-stat-row">
                        <span class="player-stat-label">Defense</span>
                        <span class="player-stat-value">${player.defense ?? 0}</span>
                    </div>
                    <div class="player-stat-row">
                        <span class="player-stat-label">Defense IQ</span>
                        <span class="player-stat-value">${player.defenseIQ ?? 0}</span>
                    </div>
                </div>
            `;
        }
    }

    if (seasonEl) {
        seasonEl.innerHTML = `
            <div class="player-stat-grid">
                <div class="player-stat-row">
                    <span class="player-stat-label">Games</span>
                    <span class="player-stat-value">${season.games}</span>
                </div>
                <div class="player-stat-row">
                    <span class="player-stat-label">Goals</span>
                    <span class="player-stat-value">${season.goals}</span>
                </div>
                <div class="player-stat-row">
                    <span class="player-stat-label">Assists</span>
                    <span class="player-stat-value">${season.assists}</span>
                </div>
                <div class="player-stat-row">
                    <span class="player-stat-label">Points</span>
                    <span class="player-stat-value">${season.points}</span>
                </div>
            </div>
        `;
    }

    if (careerEl) {
        careerEl.innerHTML = `
            <div class="player-stat-grid">
                <div class="player-stat-row">
                    <span class="player-stat-label">Games</span>
                    <span class="player-stat-value">${career.games}</span>
                </div>
                <div class="player-stat-row">
                    <span class="player-stat-label">Goals</span>
                    <span class="player-stat-value">${career.goals}</span>
                </div>
                <div class="player-stat-row">
                    <span class="player-stat-label">Assists</span>
                    <span class="player-stat-value">${career.assists}</span>
                </div>
                <div class="player-stat-row">
                    <span class="player-stat-label">Points</span>
                    <span class="player-stat-value">${career.points}</span>
                </div>
            </div>
        `;
    }

    modal.classList.remove("hidden");
}

export function closePlayerModal() {
    const modal = document.getElementById("playerModal");
    if (modal) {
        modal.classList.add("hidden");
    }
}


// ===============================
// LINEUP FOR DASHBOARD
// ===============================
export function renderLineup(lineup) {
    const container = document.getElementById("lineup");
    if (!container) return;

    container.innerHTML = "";

    if (!lineup || lineup.length === 0) {
        container.innerHTML = "<p>No lineup available</p>";
        return;
    }

    lineup.forEach(player => {
        const ovr = calculateOVR(player);
        const season = getSeasonStats(player); 

        const card = document.createElement("div");
        card.className = "player-card";

        card.innerHTML = `
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-pos">${player.pos}</div>

                <div class="player-season-line">
                    <span>GP ${season.games}</span>
                    <span>G ${season.goals}</span>
                    <span>A ${season.assists}</span>
                    <span>P ${season.points}</span>
                </div>
            </div>

            <div class="player-stats">
                <div class="player-ovr">${ovr}</div>
                <div class="player-sub">OVR</div>
            </div>
        `;

        card.addEventListener("click", () => showPlayerDetails(player));
        container.appendChild(card);
    });
}


// ===============================
// ROSTER RENDER
// ===============================
export function renderRoster(roster) {
    const container = document.getElementById("rosterList");
    if (!container) return;

    container.innerHTML = "";

    if (!roster) return;

    const { lines, goalies, scratches } = buildRosterLines(roster);

    const renderPlayerRow = (player, dimmed = false) => {
        const row = document.createElement("div");
        row.className = "roster-player";

        if (dimmed) {
            row.style.opacity = "0.6";
        }

        const season = getSeasonStats(player);

        row.innerHTML = `
            <div class="roster-left">
                <span class="roster-pos">${player.pos}</span>
                <span class="roster-name">${player.name}</span>
            </div>


            <div class="roster-right">
                <span><span class="stat-label">GP:</span> <span class="stat-value">${season.games}</span></span>
                <span><span class="stat-label">G:</span>  <span class="stat-value">${season.goals}</span></span>
                <span><span class="stat-label">A:</span>  <span class="stat-value">${season.assists}</span></span>
                <span><span class="stat-label">P:</span>  <span class="stat-value">${season.points}</span></span>
            </div>


            <div class = "roster-ovr">
                <span>${calculateOVR(player)}</span>
            </div>
        `;

        row.addEventListener("click", () => showPlayerDetails(player));
        return row;
    };

    // ===== LINES =====
    lines.forEach(line => {
        const section = document.createElement("div");
        section.className = "roster-section";
        section.innerHTML = `<h3>${line.name}</h3>`;

        line.players.forEach(player => {
            section.appendChild(renderPlayerRow(player));
        });

        container.appendChild(section);
    });

    // ===== GOALIES =====
    if (goalies.length > 0) {
        const section = document.createElement("div");
        section.className = "roster-section";
        section.innerHTML = `<h3>Goalies</h3>`;

        goalies.forEach(player => {
            section.appendChild(renderPlayerRow(player));
        });

        container.appendChild(section);
    }

    // ===== SCRATCHES =====
    if (scratches.length > 0) {
        const section = document.createElement("div");
        section.className = "roster-section";
        section.innerHTML = `<h3>Scratches</h3>`;

        scratches.forEach(player => {
            section.appendChild(renderPlayerRow(player, true));
        });

        container.appendChild(section);
    }
}


// ===============================
// STANDINGS
// ===============================
export function renderStandings(teams, userTeamName) {
    const container = document.getElementById("standings");
    if (!container) return;

    container.innerHTML = "";

    if (!teams || teams.length === 0) return;

    teams.forEach(team => {
        const games = team.wins + team.losses;
        const pct = games > 0 ? (team.wins / games).toFixed(3) : ".000";

        const row = document.createElement("tr");

        if (team.name === userTeamName) {
            row.style.fontWeight = "bold";
        }

        row.innerHTML = `
            <td>${team.name}</td>
            <td>${team.wins}</td>
            <td>${team.losses}</td>
            <td>${pct}</td>
        `;

        container.appendChild(row);
    });
}


// ===============================
// CALENDAR
// ===============================
export function renderCalendar(currentDate, getTeamGameForDate, userTeamName) {
    const container = document.getElementById("calendarList");
    if (!container) return;

    container.innerHTML = "";

    if (!currentDate) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // start of month
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = document.createElement("div");
    grid.className = "calendar-grid";

    // blank cells before the 1st
    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-cell empty";
        grid.appendChild(empty);
    }

    // actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);

        const cell = document.createElement("div");
        cell.className = "calendar-cell";

        // highlight current in-game day
        let today = currentDate;
        if (typeof window.getCurrentDate === "function") {
            today = new Date(window.getCurrentDate());
        }

        const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        if (isToday) {
            cell.classList.add("today");
        }

        const dayNumber = document.createElement("div");
        dayNumber.className = "calendar-day-number";
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);

        const game = getTeamGameForDate(userTeamName, date);

        if (game) {
            const opponent = game.home === userTeamName
                ? game.away
                : game.home;

            const abbrev = opponent.slice(0, 3).toUpperCase();

            const gameText = document.createElement("div");
            gameText.className = "calendar-game";
            gameText.textContent = abbrev;

            cell.appendChild(gameText);
        }

        grid.appendChild(cell);
    }

    container.appendChild(grid);
}


// ===============================
// UI UPDATES
// ===============================
export function updateRecord(team) {
    if (!team) return;

    const winsEl = document.getElementById("wins");
    const lossesEl = document.getElementById("losses");

    if (winsEl) winsEl.textContent = team.wins;
    if (lossesEl) lossesEl.textContent = team.losses;
}

export function updateGameResult(result) {
    const resultEl = document.getElementById("gameResult");
    if (!resultEl) return;

    if (result?.message) {
        resultEl.textContent = result.message;
        return;
    }

    resultEl.textContent = `${result.homeGoals}-${result.awayGoals}`;
}
``