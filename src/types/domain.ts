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
}

export interface CleanerWithTask extends CleanerProfile, WeeklyTaskState { }

export interface HistoryRecord {
    weekId: string; // ej: "23-05-2025/30-05-2025"
    taskName: string;
}
