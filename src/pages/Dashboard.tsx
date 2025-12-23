import { useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { useTitle } from "@/hooks/useTitle";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toggleTaskCompletion } from "@/services/cleaningService";
import { TaskCard } from "@/components/ui/TaskCard";
import { WeekDisplay } from "@/components/WeekDisplay";
import Loader from "@/components/loader/Loader";
import {
  getWeekBounds,
  addWeeks,
  parseWeekId,
  compareWeeks,
} from "@/utils/date";

export default function Dashboard() {
  useTitle("Panel - CleanApp");
  const { user } = useAuth();

  // Estado de navegación temporal
  // Inicializamos con la semana actual REAL
  const realCurrentWeek = getWeekBounds();
  const [viewWeek, setViewWeek] = useState(realCurrentWeek);

  // El hook ahora depende de la semana que miramos
  const { cleaners, loading } = useDashboardData(viewWeek);

  // Navegación
  const handlePrev = () => {
    const date = parseWeekId(viewWeek);
    const prevDate = addWeeks(date, -1);
    setViewWeek(getWeekBounds(prevDate));
  };

  const handleNext = () => {
    const date = parseWeekId(viewWeek);
    const nextDate = addWeeks(date, 1);
    setViewWeek(getWeekBounds(nextDate));
  };

  const handleToggle = async (cleanerId: string, taskName: string) => {
    const cleanerToUpdate = cleaners.find((c) => c.username === cleanerId);
    if (!cleanerToUpdate) return;

    // Pasamos viewWeek al servicio para que sepa qué semana estamos tocando
    const result = await toggleTaskCompletion(
      cleanerToUpdate,
      taskName,
      viewWeek,
    );

    if (!result.success && result.message) {
      alert(result.message); // Feedback simple de error
    }
  };

  const weekDiff = compareWeeks(viewWeek, realCurrentWeek);
  const isHistoricalView = weekDiff < 0;

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Header Navegable */}
      <header className="mt-8 flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-4 duration-700">
        <WeekDisplay
          currentWeekStr={viewWeek}
          onPrev={handlePrev}
          onNext={handleNext}
          isCurrentWeek={weekDiff === 0}
        />

        {isHistoricalView && (
          <div className="mt-4 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold border border-blue-500/30 animate-pulse">
            Modo Histórico: Completar aquí da +5 puntos
          </div>
        )}
      </header>

      {/* Grid */}
      {loading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
          {cleaners.map((cleaner) => {
            const isMyCard = user?.email === cleaner.email;

            // Solo permitimos interactuar si:
            // 1. Es mi carta
            // 2. Y (Es semana actual O es semana anterior inmediata)
            const canInteract = isMyCard && (weekDiff === 0 || weekDiff === -1);

            return (
              <div
                key={cleaner.id}
                className="animate-in fade-in zoom-in-95 duration-500"
              >
                <TaskCard
                  name={cleaner.name}
                  avatarUrl={cleaner.avatarUrl}
                  taskName={cleaner.taskName}
                  isDone={cleaner.isDone}
                  completedAt={cleaner.completedAt}
                  colorTheme={cleaner.themeColor}
                  isLate={cleaner.isLate} // Pasamos el flag
                  isInteractive={canInteract}
                  onToggle={() =>
                    handleToggle(cleaner.username, cleaner.taskName)
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
