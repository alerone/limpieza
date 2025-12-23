import { useEffect, useState } from "react";
import {
    onValue,
    ref,
    query,
    limitToLast,
    orderByChild,
} from "firebase/database";
import { db } from "@/firebase/firebase";
import { DB_PATHS } from "@/services/paths";
import { getDayString, getWeekBounds } from "@/utils/date";
import type { ActionLog } from "@/types/domain";

export function useRecentLogs(limit = 20) {
    const [logs, setLogs] = useState<ActionLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const logsRef = ref(db, DB_PATHS.logs());
        // Traemos los últimos X logs
        const recentLogsQuery = query(
            logsRef,
            orderByChild("timestamp"),
            limitToLast(limit),
        );

        const unsubscribe = onValue(recentLogsQuery, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setLogs([]);
            } else {
                const parsedLogs = Object.values(data) as ActionLog[];
                // Ordenar: Más nuevo arriba (descendente)
                parsedLogs.sort((a, b) => b.timestamp - a.timestamp);
                setLogs(parsedLogs);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [limit]);

    return { logs, loading };
}

export interface TaskTrackingInfo {
    totalCount: number; // Total de veces hecha por todos
    userCount: Record<string, number>; // Veces hecha por cada usuario: { "rubius": 1 }
}

export function useOptionalTasksTracking() {
    // Cambiamos el estado para guardar más info
    const [trackingData, setTrackingData] = useState<
        Record<string, TaskTrackingInfo>
    >({});

    const dayId = getDayString(new Date());
    const weekId = getWeekBounds();

    useEffect(() => {
        const trackingRef = ref(db, "tracking");

        const unsubscribe = onValue(trackingRef, (snapshot) => {
            const data = snapshot.val();

            if (!data) {
                setTrackingData({});
                return;
            }

            const result: Record<string, TaskTrackingInfo> = {};

            // Helper para procesar las tareas
            const processTasks = (tasksGroup: any) => {
                if (!tasksGroup) return;

                Object.keys(tasksGroup).forEach((taskId) => {
                    const entries = tasksGroup[taskId] || {}; // { pushId: { user: '...' } }
                    const values = Object.values(entries) as { user: string }[];

                    // Inicializar si no existe
                    if (!result[taskId]) {
                        result[taskId] = { totalCount: 0, userCount: {} };
                    }

                    // Sumar Total
                    result[taskId].totalCount += values.length;

                    // Sumar por Usuario
                    values.forEach((entry) => {
                        const u = entry.user;
                        result[taskId].userCount[u] =
                            (result[taskId].userCount[u] || 0) + 1;
                    });
                });
            };

            // 1. Diarias
            const todayTasks = data.daily?.[dayId.replaceAll("/", "_")] || {};
            processTasks(todayTasks);

            // 2. Semanales
            const sanitizedWeekId = weekId.replaceAll("/", "_").replaceAll(".", "_");
            const currentWeekTasks = data.weekly?.[sanitizedWeekId] || {};
            processTasks(currentWeekTasks);

            setTrackingData(result);
        });

        return () => unsubscribe();
    }, [dayId, weekId]);

    return trackingData;
}
