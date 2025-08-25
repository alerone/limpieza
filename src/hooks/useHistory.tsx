import { cleanEmail } from "../utils/users";
import { useFirebaseValue } from "./useFirebaseValue";

export type HistoryItem = {
    week: string,
    task: string
}
export function useHistory(email: string) {
    const path = `users/${cleanEmail(email)}/history`
    const data = useFirebaseValue(path)

    if (!data) return []

    const parsed: HistoryItem[] = Object.entries(data).map(([week, task]) => ({
        week: week.replaceAll("_", "/"),
        task: task as string
    }))

    return parsed
}
