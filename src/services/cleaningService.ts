import { get, ref, set, update } from "firebase/database";
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
  // 1. Obtener estado actual para invertirlo
  const userPath = DB_PATHS.weeklyUserStatus(cleaner.username);
  const userRef = ref(db, userPath);
  const snapshot = await get(userRef);

  if (!snapshot.exists())
    throw new Error("Usuario no encontrado en la semana actual");

  const data = snapshot.val();
  const newStatus = !data.done;
  const newDate = newStatus ? getPreciseDateString() : "not done";

  // 2. Preparar actualizaciones atómicas (Multi-path update)
  const updates: Record<string, any> = {};

  // Actualizar estado semanal
  updates[`${userPath}/done`] = newStatus;
  updates[`${userPath}/fecha`] = newDate;

  // Actualizar historial personal (users/{email}/history)
  // Lógica: Si NO está hecho, se añade al "Muro de la vergüenza". Si se hace, se quita.
  const currentWeekId = getWeekBounds();
  const historyPath = DB_PATHS.userHistoryItem(cleaner.email, currentWeekId);

  if (newStatus === false) {
    // Si desmarcó (ahora es pendiente), añadimos al historial
    updates[historyPath] = currentTaskName;
  } else {
    // Si marcó como hecho, borramos del historial
    // En Firebase RTDB, setear a null borra la clave
    updates[historyPath] = null;
  }

  // Ejecutamos todas las escrituras a la vez
  await update(ref(db), updates);

  return newStatus;
}
