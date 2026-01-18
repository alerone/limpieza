const PAIRS = [
    { users: ["alvaro", "rubius"], name: "Pair 1" },
    { users: ["alex", "victor"], name: "Pair 2" },
];
const PAIR_TASKS = ["Cocina", "Salón/Pasillo"];

export function getTasksRotation(weekNumber: number): Record<string, string> {
    const pairShift = weekNumber % 2;

    const pairAssignments = [
        ...PAIR_TASKS.slice(2 - pairShift),
        ...PAIR_TASKS.slice(0, 2 - pairShift),
    ];

    const assignments: Record<string, string> = {};

    PAIRS.forEach((pair, pairIndex) => {
        const task = pairAssignments[pairIndex];

        if (task === "Cocina") {
            pair.users.forEach((user) => {
                assignments[user] = "Cocina";
            });
        } else {
            const internalSwap = Math.floor((weekNumber - 1) / 2) % 2;

            if (internalSwap === 0) {
                assignments[pair.users[0]] = "Salón";
                assignments[pair.users[1]] = "Pasillo";
            } else {
                assignments[pair.users[0]] = "Pasillo";
                assignments[pair.users[1]] = "Salón";
            }
        }
    });

    return assignments;
}

/**
 * Asigna tarea a un usuario específico basado en el orden estático.
 * Asumimos el orden: Rubius, Alvaro, Victor, Alex
 */
export function getTaskForUser(username: string, weekNumber: number): string {
    const tasks = getTasksRotation(weekNumber);
    return tasks[username];
}
