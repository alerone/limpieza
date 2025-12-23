import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/firebase/firebase";
import { DB_PATHS } from "@/services/paths";
import { CLEANERS } from "@/config/cleaners";
import type { CleanerProfile } from "@/types/domain";

// Ahora devolvemos los dos valores por separado
export interface RankingItem extends CleanerProfile {
    weeks: number; // Tareas obligatorias (completedTasks)
    points: number; // Gamificación (totalPoints)
}

export function useRanking() {
    const [ranking, setRanking] = useState<RankingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const statsRef = ref(db, DB_PATHS.allStats());

        const unsubscribe = onValue(statsRef, (snapshot) => {
            const data = snapshot.val() || {};

            const parsedRanking: RankingItem[] = Object.values(CLEANERS).map(
                (cleaner) => {
                    const userStats = data[cleaner.username];
                    return {
                        ...cleaner,
                        weeks: userStats?.completedTasks || 0,
                        points: userStats?.totalPoints || 0,
                    };
                },
            );

            // Nota: Ya no ordenamos aquí porque el orden depende del modo de visualización en la UI
            setRanking(parsedRanking);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { ranking, loading };
}
