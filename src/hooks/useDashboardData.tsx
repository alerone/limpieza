import { useEffect, useState } from "react";
import { onValue, ref, off } from "firebase/database";
import { db } from "@/firebase/firebase";
import { DB_PATHS } from "@/services/paths";
import { initializeCurrentWeekIfNeeded } from "@/services/cleaningService";
import { CLEANER_LIST } from "@/config/cleaners";
import type { CleanerWithTask } from "@/types/domain";

export function useDashboardData() {
  const [data, setData] = useState<CleanerWithTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const weekPath = DB_PATHS.currentWeekRoot();
    const weekRef = ref(db, weekPath);

    const initAndSubscribe = async () => {
      try {
        // 1. Asegurar que la semana existe (Check-then-Act)
        await initializeCurrentWeekIfNeeded();

        // 2. Suscribirse a los cambios
        onValue(weekRef, (snapshot) => {
          if (!mounted) return;
          const weekData = snapshot.val();

          if (!weekData || !weekData.usuarios) {
            setLoading(false);
            return;
          }

          // 3. Mapear datos: Configuración Estática + Estado Dinámico
          const mergedData: CleanerWithTask[] = CLEANER_LIST.map((cleaner) => {
            // Datos crudos de Firebase para este usuario
            const userState = weekData.usuarios[cleaner.username];

            return {
              ...cleaner, // Datos base (id, nombre, avatar...)
              taskName: userState?.task || "Sin tarea",
              isDone: userState?.done || false,
              completedAt:
                userState?.fecha === "not done" ? null : userState?.fecha,
            };
          });

          setData(mergedData);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error inicializando dashboard:", error);
        if (mounted) setLoading(false);
      }
    };

    initAndSubscribe();

    return () => {
      mounted = false;
      off(weekRef); // Desuscribirse al desmontar
    };
  }, []);

  return { cleaners: data, loading };
}
