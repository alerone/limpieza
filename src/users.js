import { db } from './firebase.js'
import {
    get,
    orderByKey,
    onValue,
    limitToLast,
    query,
    update,
    ref,
    set,
    push,
    remove,
} from 'firebase/database'
import { getWeekBounds } from './utils.js'

export class UsersService {
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

    async AddTaskNotDone(email) {
        const rootEmail = cleanEmail(email)
        const historyRef = ref(db, this.path + rootEmail + `/history`)
        const currentWeek = getWeekBounds(new Date())
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

    async RemoveTaskNotDone(email) {
        const cleaned = cleanEmail(email)
        const historyRef = ref(db, this.path + cleaned + `/history`)
        const currentWeek = getWeekBounds(new Date())
        const lastHistory = query(historyRef, orderByKey(), limitToLast(1))

        const snapshot = await get(lastHistory)
        if (!snapshot.exists()) return

        const data = snapshot.val()
        const lastKey = Object.keys(data)[0]
        if (data[lastKey] != currentWeek) return
        const lastHistoryRef = ref(db, `${this.path}${cleaned}/history/${lastKey}`)

        await remove(lastHistoryRef)
    }
}

function cleanEmail(email) {
    return email.split("@")[0]
}
