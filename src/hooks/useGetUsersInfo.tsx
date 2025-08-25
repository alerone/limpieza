import { useEffect, useMemo } from "react"
import { getWeekOfYear } from "../utils/date"
import { useWeekTracker } from "./useWeekTracker"
import { baseUsers } from "../types/User"
import { initWeek } from "../firebase/initWeek"

const tasks = ["Cocina", "Cocina", "Salón", "Pasillo"]

const taskOrders = [
    [tasks[3], tasks[2], tasks[0], tasks[1]], // mod 0
    tasks,                                    // mod 1
    tasks.slice().reverse(),                  // mod 2
    [tasks[0], tasks[1], tasks[3], tasks[2]], // mod 3
]

function getTaskOrder() {
    const week = getWeekOfYear()
    return taskOrders[week % 4]
}

export function useGetUsersInfo() {
    const week = useWeekTracker()

    const users = useMemo(() => {
        const taskOrder = getTaskOrder()


        const users = {
            ...baseUsers,
            rubius: { ...baseUsers.rubius, task: taskOrder[0] },
            alvaro: { ...baseUsers.alvaro, task: taskOrder[1] },
            victor: { ...baseUsers.victor, task: taskOrder[2] },
            alex: { ...baseUsers.alex, task: taskOrder[3] },
        }

        return users
    }, [week])
    useEffect(() => {
        const handleWeekInit = async () => {
            await initWeek(Object.values(users))
        }

        handleWeekInit()
    }, [users])
    return users
}

