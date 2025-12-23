import { get, ref, set, update, increment, push } from "firebase/database";
import { db } from "@/firebase/firebase";
import { DB_PATHS } from "./paths";
import {
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

    console.info(`📅 Inicializando semana ${weekBounds}...`);

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
): Promise<boolean> {
    // 1. Obtener estado actual
    const userPath = DB_PATHS.weeklyUserStatus(cleaner.username);
    const userRef = ref(db, userPath);
    const snapshot = await get(userRef);

    if (!snapshot.exists())
        throw new Error("Usuario no encontrado en la semana actual");

    const data = snapshot.val();
    const newStatus = !data.done;
    const newDate = newStatus ? getPreciseDateString() : "not done";

    // === LÓGICA DE PUNTOS ===
    // Si completa: +20 puntos. Si desmarca (corrige error): -20 puntos.
    // La penalización de -10 por no hacerla se gestionará externamente al cerrar la semana.
    const pointsDelta = newStatus ? 20 : -20;
    const actionType = newStatus ? "MANDATORY_DONE" : "MANDATORY_UNDONE";
    const logDescription = newStatus
        ? `Completó su tarea semanal: ${currentTaskName}`
        : `Desmarcó su tarea: ${currentTaskName}`;

    // 2. Preparar actualizaciones atómicas
    const updates: Record<string, any> = {};

    // A) Actualizar semana actual
    updates[`${userPath}/done`] = newStatus;
    updates[`${userPath}/fecha`] = newDate;

    // B) Actualizar historial de pendientes
    const currentWeekId = getWeekBounds();
    const historyPath = DB_PATHS.userHistoryItem(cleaner.email, currentWeekId);

    if (newStatus === false) {
        updates[historyPath] = currentTaskName;
    } else {
        updates[historyPath] = null;
    }

    // Si completa (true) sumamos 1, si desmarca (false) restamos 1
    const statsPath = DB_PATHS.userStats(cleaner.username);
    updates[`${statsPath}/completedTasks`] = increment(newStatus ? 1 : -1);

    updates[`${statsPath}/totalPoints`] = increment(pointsDelta);

    // 5. Generar Log de Acción
    const newLogRef = push(ref(db, DB_PATHS.logs()));
    const logId = newLogRef.key;
    updates[`${DB_PATHS.logs()}/${logId}`] = {
        id: logId,
        timestamp: Date.now(),
        userId: cleaner.username,
        userName: cleaner.name,
        userAvatar: cleaner.avatarUrl,
        actionType: actionType,
        description: logDescription,
        pointsDelta: pointsDelta,
    };

    // Ejecutamos TODO a la vez
    await update(ref(db), updates);

    return newStatus;
}
