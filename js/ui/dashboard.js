// dashboard.js

export function renderLineup(team) {

    const lineupEl =
        document.getElementById("lineup");

    lineupEl.innerHTML = "";

    team.lineup.forEach(player => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${player.pos}</td>
            <td>${player.name}</td>
            <td>${player.rating || "-"}</td>
            <td>${player.goals || 0}</td>
            <td>${player.assists || 0}</td>
        `;

        lineupEl.appendChild(row);
    });
}

export function updateRecord(team) {

    document.getElementById("wins")
        .textContent = team.wins;

    document.getElementById("losses")
        .textContent = team.losses;
}

export function updateGameResult(result) {

    document.getElementById("gameResult")
        .textContent =
            `${result.homeGoals}-${result.awayGoals}`;
}