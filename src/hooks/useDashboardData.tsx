import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/firebase/firebase";
import { CLEANER_LIST } from "@/config/cleaners";
import type { CleanerWithTask } from "@/types/domain";

export function useDashboardData(targetWeekId: string) {
  // <--- Recibe weekId
  const [data, setData] = useState<CleanerWithTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sanitize = (str: string) =>
      str.replaceAll("/", "_").replaceAll(".", "_");
    const weekPath = `piso/${sanitize(targetWeekId)}`;

    const weekRef = ref(db, weekPath);
    setLoading(true);

    const unsubscribe = onValue(weekRef, (snapshot) => {
      const weekData = snapshot.val();

      // Simplificación: Si no hay datos, asumimos que no se hizo nada.
      const usersMap = weekData?.usuarios || {};

      const mergedData: CleanerWithTask[] = CLEANER_LIST.map((cleaner) => {
        const userState = usersMap[cleaner.username];

        return {
          ...cleaner,
          taskName: userState?.task || "N/A", // Si no existe semana, no mostramos tarea errónea
          isDone: userState?.done || false,
          completedAt:
            userState?.fecha === "not done" ? null : userState?.fecha,
          isLate: userState?.isLate || false, // <--- Mapeamos isLate
        };
      });

      setData(mergedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [targetWeekId]); // Se recarga cuando cambia la semana

  return { cleaners: data, loading };
}
