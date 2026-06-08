// rosterUtils.js

export function calculateOVR(player) {
    if (!player) return 0;

    if (player.pos === "G") {
        return Math.round(
            ((player.reflexes || 0) +
             (player.positioning || 0) +
             (player.puckControl || 0)) / 3
        );
    }

    return Math.round(
        ((player.shooting || 0) +
         (player.passing || 0) +
         (player.offenseIQ || 0) +
         (player.defense || 0)) / 4
    );
}


export function buildBestLineup(players) {

    if (!Array.isArray(players)) return [];

    const forwards = players
        .filter(p => ["C", "LW", "RW"].includes(p.pos))
        .sort((a, b) => calculateOVR(b) - calculateOVR(a));

    const defense = players
        .filter(p => p.pos === "D")
        .sort((a, b) => calculateOVR(b) - calculateOVR(a));

    const goalies = players
        .filter(p => p.pos === "G")
        .sort((a, b) => calculateOVR(b) - calculateOVR(a));

    return [
        ...forwards.slice(0, 3),
        ...defense.slice(0, 2),
        ...goalies.slice(0, 1)
    ];
}


export function buildRosterLines(players) {

    if (!Array.isArray(players)) {
        return { lines: [], goalies: [], scratches: [] };
    }

    let forwards = players.filter(p => ["C", "LW", "RW"].includes(p.pos));
    let defense = players.filter(p => p.pos === "D");
    let goalies = players.filter(p => p.pos === "G");

    // enforce limits
    forwards = forwards.slice(0, 9);
    defense = defense.slice(0, 5);
    goalies = goalies.slice(0, 2);

    const lines = [];

    // Line 1 (forwards + defense ONLY)
    lines.push({
        name: "Line 1",
        players: [
            ...forwards.slice(0, 3),
            ...defense.slice(0, 2)
        ]
    });

    // Line 2
    if (forwards.length >= 6 || defense.length >= 4) {
        lines.push({
            name: "Line 2",
            players: [
                ...forwards.slice(3, 6),
                ...defense.slice(2, 4)
            ]
        });
    }

    // track used players
    const usedIds = new Set(
        lines.flatMap(l => l.players.map(p => p.id))
    );

    // goalies NOT included in usedIds (they get their own section)

    const scratches = players.filter(p =>
        !usedIds.has(p.id) && p.pos !== "G"
    );

    return {
        lines,
        goalies,
        scratches
    };
}
``