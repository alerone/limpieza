import { useEffect, useMemo } from "react";
import { getWeekOfYear } from "../utils/date";
import { useWeekTracker } from "./useWeekTracker";
import { baseUsers } from "../types/User";
import { initWeek } from "../firebase/initWeek";

const TASKS_BASE = ["Cocina", "Cocina", "Salón", "Pasillo"];

function getTasksForWeek(weekNumber: number) {
    const shift = weekNumber % 4;
    const rotatedTasks = [
        ...TASKS_BASE.slice(4 - shift),
        ...TASKS_BASE.slice(0, 4 - shift),
    ];

    return rotatedTasks;
}

export function useGetUsersInfo() {
    const weekString = useWeekTracker();

    const users = useMemo(() => {
        const weekNumber = getWeekOfYear();
        const currentTasks = getTasksForWeek(weekNumber);

        const users = {
            ...baseUsers,
            rubius: { ...baseUsers.rubius, task: currentTasks[0] },
            alvaro: { ...baseUsers.alvaro, task: currentTasks[1] },
            victor: { ...baseUsers.victor, task: currentTasks[2] },
            alex: { ...baseUsers.alex, task: currentTasks[3] },
        };

        return users;
    }, [weekString]);

    useEffect(() => {
        const handleWeekInit = async () => {
            await initWeek(Object.values(users));
        };

        handleWeekInit();
    }, [users]);
    return users;
}
