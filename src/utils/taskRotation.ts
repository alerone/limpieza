const TASKS_POOL = ["Cocina", "Cocina", "Salón", "Pasillo"];

/**
 * Calcula qué tareas tocan en una semana específica basándose en la rotación.
 * Función pura: Inputs -> Outputs. Sin hooks.
 */
export function getTasksForWeek(weekNumber: number): string[] {
  const shift = weekNumber % 4;
  // Rotación simple del array
  return [...TASKS_POOL.slice(4 - shift), ...TASKS_POOL.slice(0, 4 - shift)];
}

/**
 * Asigna tarea a un usuario específico basado en el orden estático.
 * Asumimos el orden: Rubius, Alvaro, Victor, Alex
 */
export function getTaskForUser(username: string, weekNumber: number): string {
  const tasks = getTasksForWeek(weekNumber);
  switch (username) {
    case "rubius":
      return tasks[0];
    case "alvaro":
      return tasks[1];
    case "victor":
      return tasks[2];
    case "alex":
      return tasks[3];
    default:
      return "Sin tarea";
  }
}
