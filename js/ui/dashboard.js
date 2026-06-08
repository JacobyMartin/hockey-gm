// dashboard.js
import { buildRosterLines, calculateOVR } from "../rosterUtils.js";


// ===============================
// LINEUP FOR DASHBOARD
// ===============================
export function renderLineup(lineup) {

    const container = document.getElementById("lineup");
    container.innerHTML = "";

    if (!lineup || lineup.length === 0) {
        container.innerHTML = "<p>No lineup available</p>";
        return;
    }

    lineup.forEach(player => {

        const ovr = calculateOVR(player);

        const card = document.createElement("div");
        card.className = "player-card";

        card.innerHTML = `
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-pos">${player.pos}</div>
            </div>

            <div class="player-stats">
                <div class="player-ovr">${ovr}</div>
                <div class="player-sub">OVR</div>
            </div>
        `;

        container.appendChild(card);
    });
}


// ===============================
// ROSTER RENDER
// ===============================
export function renderRoster(roster) {

    const container = document.getElementById("rosterList");
    container.innerHTML = "";

    if (!roster) return;

    const { lines, goalies, scratches } = buildRosterLines(roster);

    // ===== LINES =====
    lines.forEach(line => {

        const section = document.createElement("div");
        section.className = "roster-section";

        section.innerHTML = `<h3>${line.name}</h3>`;

        line.players.forEach(player => {

            const row = document.createElement("div");
            row.className = "roster-player";

            row.innerHTML = `
                <div class="roster-left">
                    <span class="roster-pos">${player.pos}</span>
                    <span class="roster-name">${player.name}</span>
                </div>
                <div class="roster-right">
                    ${calculateOVR(player)}
                </div>
            `;

            section.appendChild(row);
        });

        container.appendChild(section);
    });


    // ===== GOALIES =====
    if (goalies.length > 0) {

        const section = document.createElement("div");
        section.className = "roster-section";

        section.innerHTML = `<h3>Goalies</h3>`;

        goalies.forEach(player => {

            const row = document.createElement("div");
            row.className = "roster-player";

            row.innerHTML = `
                <div class="roster-left">
                    <span class="roster-pos">${player.pos}</span>
                    <span class="roster-name">${player.name}</span>
                </div>
                <div class="roster-right">
                    ${calculateOVR(player)}
                </div>
            `;

            section.appendChild(row);
        });

        container.appendChild(section);
    }


    // ===== SCRATCHES =====
    if (scratches.length > 0) {

        const section = document.createElement("div");
        section.className = "roster-section";

        section.innerHTML = `<h3>Scratches</h3>`;

        scratches.forEach(player => {

            const row = document.createElement("div");
            row.className = "roster-player";

            row.style.opacity = "0.6"; // highlight scratches

            row.innerHTML = `
                <div class="roster-left">
                    <span class="roster-pos">${player.pos}</span>
                    <span class="roster-name">${player.name}</span>
                </div>
                <div class="roster-right">
                    ${calculateOVR(player)}
                </div>
            `;

            section.appendChild(row);
        });

        container.appendChild(section);
    }
}
// ===============================
//RENDER STANDINGS
// ===============================
export function renderStandings(teams, userTeamName) {

    const container = document.getElementById("standings");
    container.innerHTML = "";

    if (!teams || teams.length === 0) return;

    teams.forEach(team => {

        const games = team.wins + team.losses;
        const pct = games > 0 ? (team.wins / games).toFixed(3) : ".000";

        const row = document.createElement("tr");

        // highlight user team
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
// UI UPDATES
// ===============================
export function updateRecord(team) {

    document.getElementById("wins").textContent = team.wins;
    document.getElementById("losses").textContent = team.losses;
}

export function updateGameResult(result) {

    document.getElementById("gameResult")
        .textContent = `${result.homeGoals}-${result.awayGoals}`;
}