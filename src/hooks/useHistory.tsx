import { useEffect, useState } from "react";
import { onValue, ref, off } from "firebase/database";
import { db } from "@/firebase/firebase";
import { DB_PATHS } from "@/services/paths";

export type HistoryItem = {
  week: string;
  task: string;
};

export function useHistory(email: string | undefined | null) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si no hay email (ej: no logueado o cargando), no hacemos nada
    if (!email) {
      setLoading(false);
      return;
    }

    // 1. Obtenemos la ruta centralizada (sin strings mágicos)
    const path = DB_PATHS.userHistoryRoot(email);
    const historyRef = ref(db, path);

    // 2. Suscripción a Firebase
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setHistory([]);
      } else {
        // 3. Transformación de datos: { "12_05_2025": "Cocina" } -> Array
        const parsed: HistoryItem[] = Object.entries(data).map(
          ([key, task]) => ({
            // Revertimos el sanitizado: "12_05" -> "12/05"
            week: key.replaceAll("_", "/"),
            task: task as string,
          }),
        );

        // Opcional: Ordenar por fecha (string) descendente si quisieras
        setHistory(parsed.reverse());
      }
      setLoading(false);
    });

    // Cleanup al desmontar
    return () => off(historyRef, "value", unsubscribe);
  }, [email]);

  return { history, loading };
}
