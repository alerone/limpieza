import { useAuth } from "@/auth/AuthProvider";
import { useTitle } from "@/hooks/useTitle";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toggleTaskCompletion } from "@/services/cleaningService";
import { TaskCard } from "@/components/ui/TaskCard";
import { WeekDisplay } from "@/components/WeekDisplay";
import { Loader2 } from "lucide-react"; // Icono spinner

export default function Dashboard() {
    useTitle("Panel - CleanApp");
    const { user } = useAuth();

    // Hook inteligente: Datos y Loading
    const { cleaners, loading } = useDashboardData();

    const handleToggle = async (cleanerId: string, taskName: string) => {
        const cleanerToUpdate = cleaners.find((c) => c.username === cleanerId);
        if (!cleanerToUpdate) return;

        try {
            await toggleTaskCompletion(cleanerToUpdate, taskName);
        } catch (error) {
            console.error("Error al actualizar tarea:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                {/* Spinner animado en lugar de Skeleton */}
                <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <span className="text-sm font-medium tracking-widest uppercase">
                        Cargando Tareas...
                    </span>
                </div>
            </div>
        );
    }

    // Ordenar usuarios: Primero YO, luego el resto (mejora UX)
    const sortedCleaners = [...cleaners].sort((a, b) => {
        if (a.email === user?.email) return -1;
        if (b.email === user?.email) return 1;
        return 0;
    });

    return (
        <div className="flex flex-col gap-10 pb-10">
            {/* Header flotante */}
            <header className="mt-4 md:mt-8 animate-in slide-in-from-top-5 duration-700 fade-in">
                <WeekDisplay />
            </header>

            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedCleaners.map((cleaner, index) => {
                    const isMyCard = user?.email === cleaner.email;

                    return (
                        <div
                            key={cleaner.id}
                            className="animate-in slide-in-from-bottom-5 duration-500 fade-in fill-mode-backwards"
                            style={{ animationDelay: `${index * 100}ms` }} // Animación escalonada
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
