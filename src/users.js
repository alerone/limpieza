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

class UsersService {
    constructor() {
        this.db = db
        this.path = 'users/'
    }

    insert(user, data) {
        set(ref(db, this.path + user), data)
    }

    async AddTaskNotDone(userName) {
        const historyRef = ref(db, this.path + userName + `/history`)
        const week = getWeekBounds(new Date())
        await push(historyRef, week)
    }

    async RemoveTaskNotDone(userName) {
        const historyRef = ref(db, this.path + userName + `/history`)
        const currentWeek = getWeekBounds(new Date())
        const lastHistory = query(historyRef, orderByKey(), limitToLast(1))

        const snapshot = await get(lastHistory)
        if (!snapshot.exists()) return

        const data = snapshot.val()
        const lastKey = Object.keys(data)[0]
        if (data[lastKey] != currentWeek) return
        const lastHistoryRef = ref(db, `${this.path}${userName}/history/${lastKey}`)

        await remove(lastHistoryRef)
    }
}
