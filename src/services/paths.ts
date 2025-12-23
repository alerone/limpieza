import { getDayString, getWeekBounds } from "@/utils/date";
import { cleanEmail } from "@/utils/users";

const ROOT_STATS = "stats"; // Nuevo nodo raíz
const ROOT_APP = "piso";
const ROOT_USERS = "users";
const ROOT_LOGS = "logs";
const ROOT_TRACKING = "tracking";

// Helper para sanitizar strings en claves de Firebase (evita repetir replaceAll)
const sanitize = (str: string) => str.replaceAll("/", "_").replaceAll(".", "_");

export const DB_PATHS = {
    // Ruta Raíz de la semana actual: piso/12_05_2025-18_05_2025/
    currentWeekRoot: () => {
        const weekId = sanitize(getWeekBounds());
        return `${ROOT_APP}/${weekId}`;
    },

    // Ruta de un usuario específico en la semana: piso/.../usuarios/rubius
    weeklyUserStatus: (username: string) => {
        return `${DB_PATHS.currentWeekRoot()}/usuarios/${username}`;
    },

    // Ruta específica de un item en el historial: users/rubius/history/12_05_2025-18_05_2025
    userHistoryItem: (email: string, weekId: string) => {
        return `${ROOT_USERS}/${cleanEmail(email)}/history/${sanitize(weekId)}`;
    },

    // Ruta raíz del historial de un usuario
    userHistoryRoot: (email: string) => {
        return `${ROOT_USERS}/${cleanEmail(email)}/history`;
    },
    userStats: (username: string) => {
        return `${ROOT_STATS}/${username}`;
    },

    // Ruta para leer todos los stats (para la lista del ranking)
    allStats: () => {
        return `${ROOT_STATS}`;
    },

    logs: () => ROOT_LOGS,

    // Tracking de tareas opcionales: tracking/daily/12_05_2025/dry_dishes
    optionalTaskTracking: (frequency: "daily" | "weekly", taskId: string) => {
        const periodId =
            frequency === "daily"
                ? sanitize(getDayString(new Date())) // ID del día: 23_05_2025
                : sanitize(getWeekBounds()); // ID de la semana: 19_05-25_05

        return `${ROOT_TRACKING}/${frequency}/${periodId}/${taskId}`;
    },
};
