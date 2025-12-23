export type BrandColor = "blue" | "green" | "purple" | "yellow" | "pink";

export interface CleanerProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  avatarUrl: string;
  themeColor: BrandColor;
}

export interface WeeklyTaskState {
  taskName: string;
  isDone: boolean;
  completedAt: string | null;
  isLate?: boolean;
}

export interface CleanerWithTask extends CleanerProfile, WeeklyTaskState {}

export interface HistoryRecord {
  weekId: string; // ej: "23-05-2025/30-05-2025"
  taskName: string;
}

export interface UserStats {
  username: string;
  completedTasks: number;
}

export type TaskFrequency = "daily" | "weekly";

// Definición estática de una tarea opcional
export interface OptionalTaskDef {
  id: string;
  label: string;
  description?: string;
  points: number;
  frequency: TaskFrequency;
  maxPerPeriod: number; // Ej: 1 vez al día (global)
  // conditions?: (userRole: string) => boolean; // Para "si no le toca cocina" (lo haremos por lógica simple primero)
}

// Entrada en el LOG de actividad
export interface ActionLog {
  id: string;
  timestamp: number;
  userId: string;
  userName: string;
  userAvatar: string;
  actionType:
    | "MANDATORY_DONE"
    | "MANDATORY_UNDONE"
    | "OPTIONAL_CLAIMED"
    | "PENALTY";
  description: string;
  pointsDelta: number; // Puntos sumados o restados (+20, -10, +5)
}
