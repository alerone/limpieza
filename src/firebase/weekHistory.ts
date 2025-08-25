import { get, limitToLast, orderByKey, query, ref, update } from "firebase/database"
import { db } from "./firebase"
import { getPreciseDateString, getWeekBounds } from "../utils/date"

const root = "piso"

export async function toggleDone(userKey: string) {
    const currentWeekPath = getCurrentWeekPath()
    const path = `${currentWeekPath}/usuarios/${userKey}`
    const userRef = ref(db, path)
    const snapshot = await get(userRef)


    if (!snapshot.exists()) {
        console.error(`The user ${userKey} does not exist on database`)
        return
    }

    const usuario = snapshot.val()
    const newStatus = !usuario.done

    const hoy = getPreciseDateString()
    const newDate = newStatus ? hoy : 'not done'

    await update(userRef, { done: newStatus, fecha: newDate })

    return newStatus
}

export function getCurrentWeekPath() {
    const currentWeek = getWeekBounds().replaceAll("/", "_")
    return `${root}/${currentWeek}/`
}

export async function getLastWeekId() {
    const weeksRef = ref(db, 'piso')
    const q = query(weeksRef, orderByKey(), limitToLast(1))
    const snapshot = await get(q)

    if (snapshot.exists()) {
        const data = snapshot.val()
        const [id] = Object.keys(data)
        return id
    }

    return null
}

export function getCurrentWeekUserPath(user: string) {
    const currentWeek = getCurrentWeekPath()
    console.log(currentWeek)
    return `${currentWeek}/usuarios/${user}`
}

export async function getCurrentWeekInstance() {
    const currentWeek = getCurrentWeekPath()

    const userRef = ref(db, currentWeek)
    const snapshot = await get(userRef)

    return snapshot
}
