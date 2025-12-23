import { useAuth } from "@/auth/AuthProvider";
import { useTitle } from "@/hooks/useTitle";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toggleTaskCompletion } from "@/services/cleaningService";
import { TaskCard } from "@/components/ui/TaskCard";
import { WeekDisplay } from "@/components/WeekDisplay"; // Asumo que mantenemos este por ahora
import Loader from "@/components/loader/Loader";

export default function Dashboard() {
  useTitle("Panel - CleanApp");
  const { user } = useAuth();

  // Hook inteligente: Datos y Loading centralizados
  const { cleaners, loading } = useDashboardData();

  const handleToggle = async (cleanerId: string, taskName: string) => {
    // Buscamos el objeto completo del cleaner para pasarlo al servicio
    const cleanerToUpdate = cleaners.find((c) => c.username === cleanerId);
    if (!cleanerToUpdate) return;

    try {
      await toggleTaskCompletion(cleanerToUpdate, taskName);
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      // Aquí podrías añadir un toast de error si quisieras
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center flex-col gap-4">
        <Loader />
        <p className="text-gray-500 animate-pulse">Cargando tareas...</p>
      </div>
    );
  }

  // Ordenar usuarios: Primero YO (el usuario logueado), luego el resto.
  // Mejora UX: No tengo que buscarme en la lista.
  const sortedCleaners = [...cleaners].sort((a, b) => {
    if (a.email === user?.email) return -1;
    if (b.email === user?.email) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Header: Información de la semana */}
      <header className="mt-8 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700">
        <WeekDisplay />
      </header>

      {/* Grid de Tarjetas */}
      {/* Mobile-first: 1 columna, luego 2, luego 4 en pantallas grandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
        {sortedCleaners.map((cleaner) => {
          const isMyCard = user?.email === cleaner.email;

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
                isInteractive={isMyCard}
                onToggle={() =>
                  handleToggle(cleaner.username, cleaner.taskName)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
