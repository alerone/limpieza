import { getWeekBounds } from "@/utils/date";
import { cleanEmail } from "@/utils/users";

const ROOT_APP = "piso";
const ROOT_USERS = "users";

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
};
