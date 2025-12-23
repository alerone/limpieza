import { push, ref, update, increment, get } from "firebase/database";
import { db } from "@/firebase/firebase";
import { DB_PATHS } from "./paths";
import type { CleanerProfile } from "@/types/domain";

/**
 * Registra una acción en el LOG y actualiza los puntos del usuario.
 * Todo ocurre en una actualización atómica.
 */
export async function logActionAndAddPoints(
    user: CleanerProfile,
    actionType:
        | "MANDATORY_DONE"
        | "MANDATORY_UNDONE"
        | "OPTIONAL_CLAIMED"
        | "PENALTY",
    description: string,
    points: number,
) {
    const timestamp = Date.now();

    // 1. Preparar entrada del Log
    const newLogRef = push(ref(db, DB_PATHS.logs())); // Genera ID único
    const logId = newLogRef.key;

    const logEntry = {
        id: logId,
        timestamp,
        userId: user.username,
        userName: user.name,
        userAvatar: user.avatarUrl,
        actionType,
        description,
        pointsDelta: points,
    };

    // 2. Preparar actualizaciones
    const updates: Record<string, any> = {};

    // A) Guardar Log
    updates[`${DB_PATHS.logs()}/${logId}`] = logEntry;

    // B) Actualizar Puntos Totales del Usuario (Atomic Increment)
    // Nota: Guardamos en 'stats/{user}/totalPoints' para diferenciar de 'completedTasks' (semanas)
    const statsPath = DB_PATHS.userStats(user.username);
    updates[`${statsPath}/totalPoints`] = increment(points);

    // Ejecutar
    await update(ref(db), updates);
}

/**
 * Verifica cuantas veces se ha hecho una tarea en el periodo actual (día o semana).
 */
export async function getTaskUsageCount(
    frequency: "daily" | "weekly",
    taskId: string,
): Promise<number> {
    const path = DB_PATHS.optionalTaskTracking(frequency, taskId);
    const snapshot = await get(ref(db, path));

    if (!snapshot.exists()) return 0;

    // El tracking será un objeto: { pushId1: "rubius", pushId2: "alvaro" }
    // Contamos las claves
    return Object.keys(snapshot.val()).length;
}

/**
 * Reclama una tarea opcional (Validando límites y sumando puntos)
 */
export async function claimOptionalTask(
    user: CleanerProfile,
    taskId: string,
    taskLabel: string,
    points: number,
    frequency: "daily" | "weekly",
    maxPerPeriod: number,
): Promise<{ success: boolean; message: string }> {
    const trackingPath = DB_PATHS.optionalTaskTracking(frequency, taskId);

    // 1. Check-then-Act: Verificamos límites (esto tiene una pequeña condición de carrera pero aceptable para una app casera)
    const usageCount = await getTaskUsageCount(frequency, taskId);

    if (usageCount >= maxPerPeriod) {
        return {
            success: false,
            message: "Esta tarea ya ha alcanzado el límite para este periodo.",
        };
    }

    // 2. Preparar Log y Tracking
    const timestamp = Date.now();
    const newLogRef = push(ref(db, DB_PATHS.logs()));
    const logId = newLogRef.key;

    const updates: Record<string, any> = {};

    // A) Tracking: Guardamos que este usuario hizo la tarea
    // tracking/daily/ID_DIA/taskId/NUEVO_ID = username
    const newTrackingRef = push(ref(db, trackingPath));
    updates[`${trackingPath}/${newTrackingRef.key}`] = {
        user: user.username,
        timestamp,
    };

    // B) Log Global
    updates[`${DB_PATHS.logs()}/${logId}`] = {
        id: logId,
        timestamp,
        userId: user.username,
        userName: user.name,
        userAvatar: user.avatarUrl,
        actionType: "OPTIONAL_CLAIMED",
        description: `Completó opcional: ${taskLabel}`,
        pointsDelta: points,
    };

    // C) Puntos
    updates[`${DB_PATHS.userStats(user.username)}/totalPoints`] =
        increment(points);

    await update(ref(db), updates);

    return { success: true, message: `¡Tarea reclamada! +${points} puntos.` };
}

export async function unclaimOptionalTask(
    user: CleanerProfile,
    taskId: string,
    taskLabel: string,
    points: number,
    frequency: "daily" | "weekly",
): Promise<{ success: boolean; message: string }> {
    // 1. Obtener ruta del tracking actual
    const trackingPath = DB_PATHS.optionalTaskTracking(frequency, taskId);
    const trackingRef = ref(db, trackingPath);
    const snapshot = await get(trackingRef);

    if (!snapshot.exists()) {
        return {
            success: false,
            message: "No se encontró registro para deshacer.",
        };
    }

    const data = snapshot.val(); // Objeto: { "pushId1": { user: "rubius"... }, "pushId2": ... }

    // 2. Buscar la última entrada que pertenezca a ESTE usuario
    // Convertimos a array [ [key, val], [key, val] ]
    const entries = Object.entries(data) as [
        string,
        { user: string; timestamp: number },
    ][];

    // Filtramos por usuario y ordenamos por fecha descendente (para borrar el último)
    const userEntries = entries
        .filter(([_, val]) => val.user === user.username)
        .sort((a, b) => b[1].timestamp - a[1].timestamp);

    if (userEntries.length === 0) {
        return {
            success: false,
            message: "No has reclamado esta tarea en el periodo actual.",
        };
    }

    const [entryToDeleteKey] = userEntries[0]; // El ID de Firebase a borrar

    // 3. Preparar actualizaciones atómicas
    const updates: Record<string, any> = {};
    const timestamp = Date.now();
    const newLogRef = push(ref(db, DB_PATHS.logs()));
    const logId = newLogRef.key;

    // A) Borrar Tracking (Setear a null borra la clave)
    updates[`${trackingPath}/${entryToDeleteKey}`] = null;

    // B) Restar Puntos
    updates[`${DB_PATHS.userStats(user.username)}/totalPoints`] =
        increment(-points);

    // C) Log de Corrección
    updates[`${DB_PATHS.logs()}/${logId}`] = {
        id: logId,
        timestamp,
        userId: user.username,
        userName: user.name,
        userAvatar: user.avatarUrl,
        actionType: "PENALTY", // Usamos PENALTY o creamos uno nuevo como CORRECTION
        description: `Corrigió error: ${taskLabel}`,
        pointsDelta: -points,
    };

    await update(ref(db), updates);

    return { success: true, message: "Corrección realizada." };
}
