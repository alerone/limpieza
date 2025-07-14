import { db } from "./firebase.js"
import {
    get,
    orderByKey,
    onValue,
    limitToLast,
    query,
    ref,
    set,
    push,
    remove,
} from 'firebase/database'
import { getWeekBounds } from './utils.js'

const emails = {
    alvaro: import.meta.env.VITE_EMAIL_ALVARO,
    rubius: import.meta.env.VITE_EMAIL_RUBIUS,
    victor: import.meta.env.VITE_EMAIL_VICTOR,
    alex: import.meta.env.VITE_EMAIL_ALEX,
}

const users = {
    rubius: { name: 'Rubiu' },
    alvaro: { name: 'Álvaro' },
    victor: { name: 'Víctor' },
    alex: { name: 'Alex' },
}

class UsersService {
    constructor() {
        this.db = db
        this.path = 'users/'
    }

    insert(user, data) {
        set(ref(db, this.path + user), data)
    }

    initUsers(users) {
        for (const user of users) {
            const rootEmail = cleanEmail(user.email)
            this.insert(rootEmail, user)
        }
    }

    async addTaskNotDone(email) {
        const historyRef = ref(db, this.#getHistoryPath(email))
        const currentWeek = getWeekBounds()
        const lastHistory = query(historyRef, orderByKey(), limitToLast(1))
        const snapshot = await get(lastHistory)

        if (!snapshot.exists()) {
            await push(historyRef, currentWeek)
            return
        }

        const data = snapshot.val()
        const lastKey = Object.keys(data)[0]
        if (data[lastKey] == currentWeek) return

        await push(historyRef, currentWeek)
    }

    async removeTaskNotDone(email) {
        const historyPath = this.#getHistoryPath(email)
        const historyRef = ref(db, historyPath)
        const currentWeek = getWeekBounds()
        const lastHistory = query(historyRef, orderByKey(), limitToLast(1))

        const snapshot = await get(lastHistory)
        if (!snapshot.exists()) return

        const data = snapshot.val()
        const lastKey = Object.keys(data)[0]
        if (data[lastKey] != currentWeek) return
        const lastHistoryRef = ref(db, `${historyPath}/${lastKey}`)

        await remove(lastHistoryRef)
    }

    async listenToUserHistory(email = "lopezalvarezalvaro1@gmail.com", callback) {
        const historyRef = ref(db, this.#getHistoryPath(email))

        onValue(historyRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                callback(Object.values(data))
            }
        })
    }

    #getHistoryPath(email) {
        return this.path + cleanEmail(email) + "/history"
    }
}

function cleanEmail(email) {
    return email.split("@")[0]
}

export const userService = new UsersService()

export function getUserProfileImage(email) {
    switch (email) {
        case emails.alex:
            return "./images/alex.jpg"
        case emails.alvaro:
            return "./images/me.jpg"
        case emails.rubius:
            return "./images/rubiu.jpg"
        case emails.victor:
            return "./images/victor.jpg"
    }
}

export function getUserName(email) {
    switch (email) {
        case emails.alex:
            return users.alex.name
        case emails.alvaro:
            return users.alvaro.name
        case emails.rubius:
            return users.rubius.name
        case emails.victor:
            return users.victor.name
    }
}
