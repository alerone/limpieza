import { get, ref, remove, set } from "firebase/database"
import { db } from "./firebase"
import { cleanEmail } from "../utils/users"
import { getWeekBounds } from "../utils/date"

export async function addTaskNotDone(email: string, task: string) {
    const currentWeekPath = getCurrentWeekUserHistoryPath(email)
    const historyRef = ref(db, currentWeekPath)
    const snapshot = await get(historyRef)

    if (!snapshot.exists()) {
        await set(historyRef, task)
    }
}

export async function removeTaskNotDone(email: string) {
    const currentWeekPath = getCurrentWeekUserHistoryPath(email)
    const historyRef = ref(db, currentWeekPath)
    const snapshot = await get(historyRef)

    if (snapshot.exists()) {
        await remove(historyRef)
    }
}

function getCurrentWeekUserHistoryPath(email: string) {
    const currentWeek = getWeekBounds().replaceAll("/", "_")
    return `users/${cleanEmail(email)}/history/${currentWeek}`
}
