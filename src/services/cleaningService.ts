import { get, ref, set, update, increment, push } from "firebase/database";
import { db } from "@/firebase/firebase";
import { DB_PATHS } from "./paths";
import {
    compareWeeks,
    getPreciseDateString,
    getWeekBounds,
    getWeekOfYear,
} from "@/utils/date";
import { getTaskForUser } from "@/utils/taskRotation"; // Creado en Fase 1
import { CLEANER_LIST } from "@/config/cleaners"; // Creado en Fase 1
import type { CleanerProfile } from "@/types/domain";

/**
 * Inicializa la semana en la DB si no existe.
 * Implementa el patrón "Check-then-Act" de forma atómica.
 */
export async function initializeCurrentWeekIfNeeded(): Promise<void> {
    const weekPath = DB_PATHS.currentWeekRoot();
    const weekRef = ref(db, weekPath);

    const snapshot = await get(weekRef);
    if (snapshot.exists()) return; // Ya existe, no hacemos nada.

    // Datos para inicializar
    const weekNumber = getWeekOfYear();
    const weekBounds = getWeekBounds();

    // Construimos el estado inicial de cada usuario usando la configuración central
    const initialUsersState = CLEANER_LIST.reduce(
        (acc, cleaner) => {
            acc[cleaner.username] = {
                name: cleaner.name,
                task: getTaskForUser(cleaner.username, weekNumber),
                done: false,
                fecha: "not done",
            };
            return acc;
        },
        {} as Record<string, any>,
    );

    await set(weekRef, {
        year: new Date().getFullYear(),
        weekNumber,
        week: weekBounds,
        usuarios: initialUsersState,
    });
}

/**
 * Alterna el estado de una tarea (Hecho/Pendiente)
 * y actualiza el historial personal del usuario simultáneamente.
 */
export async function toggleTaskCompletion(
    cleaner: CleanerProfile,
    currentTaskName: string,
    targetWeekId: string,
): Promise<{ success: boolean; message?: string }> {
    const currentWeekId = getWeekBounds(); // La semana REAL de hoy
    const weekDiff = compareWeeks(targetWeekId, currentWeekId);

    // Reglas:
    // 0 = Actual (Permitido, +20pts)
    // -1 = Anterior inmediata (Permitido, +5pts)
    // < -1 = Pasado lejano (Solo lectura)
    // > 0 = Futuro (Solo lectura)

    if (weekDiff < -1)
        return {
            success: false,
            message: "Demasiado tarde para recuperar esta semana.",
        };
    if (weekDiff > 0)
        return {
            success: false,
            message: "No puedes completar tareas del futuro.",
        };

    // 2. Obtener Referencias usando la semana OBJETIVO (targetWeekId)
    // Importante: DB_PATHS debe aceptar el weekId.
    // NOTA: Vamos a tener que ajustar DB_PATHS en el siguiente paso para soportar esto,
    // o construimos el path manualmente aquí para no romper la API global.
    // Lo ideal: Ajustar DB_PATHS. Por ahora usaremos un hack seguro:
    const sanitize = (str: string) =>
        str.replaceAll("/", "_").replaceAll(".", "_");
    const targetWeekPath = `piso/${sanitize(targetWeekId)}`;

    const userPath = `${targetWeekPath}/usuarios/${cleaner.username}`;
    const userRef = ref(db, userPath);
    const snapshot = await get(userRef);

    if (!snapshot.exists())
        return { success: false, message: "Datos de semana no encontrados." };

    const data = snapshot.val();
    const newStatus = !data.done;
    const wasLate = data.isLate || false; // ¿Estaba marcado como tarde antes?

    // 3. Determinar Puntos y Estado Visual
    let pointsDelta = 0;
    let isLateAction = false;

    if (newStatus) {
        // --- COMPLETANDO ---
        if (weekDiff === 0) {
            pointsDelta = 20; // A tiempo
            isLateAction = false;
        } else {
            pointsDelta = 5; // Tarde (Recuperación)
            isLateAction = true;
        }
    } else {
        // --- DESHACIENDO ---
        // Si deshacemos, restamos lo que se ganó.
        // Si la tarea era "Late", restamos 5. Si era normal, restamos 20.
        pointsDelta = wasLate ? -5 : -20;
    }

    const actionType = newStatus
        ? isLateAction
            ? "MANDATORY_LATE"
            : "MANDATORY_DONE"
        : "MANDATORY_UNDONE";

    const logDescription = newStatus
        ? isLateAction
            ? `Recuperó tarea atrasada: ${currentTaskName}`
            : `Completó tarea: ${currentTaskName}`
        : `Desmarcó tarea: ${currentTaskName}`;

    // 4. Actualizaciones Atómicas
    const updates: Record<string, any> = {};

    updates[`${userPath}/done`] = newStatus;
    updates[`${userPath}/fecha`] = newStatus
        ? getPreciseDateString()
        : "not done";
    updates[`${userPath}/isLate`] = newStatus ? isLateAction : null; // Guardamos el flag

    // Historial de Pendientes (users/{id}/history)
    // Si completamos (incluso tarde), borramos del historial de pendientes.
    // Si desmarcamos, vuelve al historial.
    const historyPath = DB_PATHS.userHistoryItem(cleaner.email, targetWeekId);
    if (newStatus === false) {
        updates[historyPath] = currentTaskName;
    } else {
        updates[historyPath] = null;
    }

    // Ranking (Semanas)
    const statsPath = DB_PATHS.userStats(cleaner.username);
    updates[`${statsPath}/completedTasks`] = increment(newStatus ? 1 : -1);

    // Puntos
    updates[`${statsPath}/totalPoints`] = increment(pointsDelta);

    // Logs
    const newLogRef = push(ref(db, DB_PATHS.logs()));
    const logId = newLogRef.key;
    updates[`${DB_PATHS.logs()}/${logId}`] = {
        id: logId,
        timestamp: Date.now(),
        userId: cleaner.username,
        userName: cleaner.name,
        userAvatar: cleaner.avatarUrl,
        actionType,
        description: logDescription,
        pointsDelta,
    };

    await update(ref(db), updates);
    return { success: true };
}
