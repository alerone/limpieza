import { getWeekBounds } from "@/utils/date";

const ROOT_APP = "piso";
const ROOT_USERS = "users";

// Helper para sanitizar strings en claves de Firebase
const sanitize = (str: string) => str.replaceAll("/", "_").replaceAll(".", "_");

export const DB_PATHS = {
    // Ruta: piso/12_05_2025-18_05_2025/
    currentWeekRoot: () => {
        const weekId = sanitize(getWeekBounds());
        return `${ROOT_APP}/${weekId}`;
    },

    // Ruta: piso/12_05_2025-18_05_2025/usuarios/rubius
    weeklyUserStatus: (username: string) => {
        return `${DB_PATHS.currentWeekRoot()}/usuarios/${username}`;
    },

    // Ruta: users/rubius/history/12_05_2025-18_05_2025
    userHistoryItem: (email: string, weekId: string) => {
        return `${ROOT_USERS}/${cleanEmail(email)}/history/${sanitize(weekId)}`;
    },

    // Ruta: users/rubius/history
    userHistoryRoot: (email: string) => {
        return `${ROOT_USERS}/${cleanEmail(email)}/history`;
    },
};
