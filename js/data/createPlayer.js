export function createPlayer(data) {

    return {

        id: crypto.randomUUID(),

        name: data.name,

        age: data.age || 20,

        nationality:
            data.nationality || "Canada",

        pos: data.pos,

        shooting: data.shooting || 50,
        passing: data.passing || 50,
        offenseIQ: data.offenseIQ || 50,

        defense: data.defense || 50,
        defenseIQ: data.defenseIQ || 50,

        careerStats: {

            games: 0,
            goals: 0,
            assists: 0,
            points: 0
        }
    };
}