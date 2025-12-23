import { ref, set } from "firebase/database";
import { getMonday, getWeekBounds, getWeekOfYear } from "@/utils/date";
import { db } from "./firebase";
import type { User } from "@/types/User";
import { getCurrentWeekInstance, getCurrentWeekPath } from "./weekHistory";

export async function initWeek(usuarios: User[]) {
    const weekNumber = getWeekOfYear();
    const monday = getMonday();
    const week = getWeekBounds(monday);
    const year = monday.getFullYear();

    const currentWeekSnapshot = await getCurrentWeekInstance();
    console.log(currentWeekSnapshot.key);

    if (currentWeekSnapshot.exists()) return;

    const parsedUsers = usuarios.reduce(
        (acc, user) => {
            acc[user.username] = {
                task: user.task,
                done: false,
                date: "not done",
                name: user.name,
            };
            return acc;
        },
        {} as Record<
            string,
            { task?: string; done: boolean; date: string; name: string }
        >,
    );
    const currentWeekRef = ref(db, getCurrentWeekPath());
    await set(currentWeekRef, {
        year: year,
        weekNumber: weekNumber,
        week: week,
        usuarios: parsedUsers,
    });
}
