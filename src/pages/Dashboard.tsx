import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { useTitle } from "@/hooks/useTitle";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toggleTaskCompletion } from "@/services/cleaningService";
import { TaskCard } from "@/components/ui/TaskCard";
import { Avatar } from "@/components/ui/Avatar";
import { WeekDisplay } from "@/components/WeekDisplay";
import Loader from "@/components/loader/Loader";
import { CLEANERS } from "@/config/cleaners";

// Helper para encontrar el avatar del usuario actual para el header
const getCurrentUserAvatar = (email: string | null) => {
    const user = Object.values(CLEANERS).find((u) => u.email === email);
    return user?.avatarUrl || "";
};

function Dashboard() {
    useTitle("Home - Tareas de Limpieza");
    const navigate = useNavigate();
    const { user } = useAuth();

    // 1. Hook inteligente: Datos y Loading
    const { cleaners, loading } = useDashboardData();

    const handleToggle = async (cleanerId: string, taskName: string) => {
        // Buscamos el perfil completo del usuario a modificar
        const cleanerToUpdate = cleaners.find((c) => c.username === cleanerId);
        if (!cleanerToUpdate) return;

        try {
            await toggleTaskCompletion(cleanerToUpdate, taskName);
        } catch (error) {
            console.error("Error al actualizar tarea:", error);
            alert("Hubo un error al guardar el estado. Inténtalo de nuevo.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-800 to-pink-900 pb-10">
            {/* Header: Avatar Perfil + Semana */}
            <header className="relative flex flex-col items-center pt-8 px-4 gap-6">
                <div className="absolute top-4 right-4 md:right-8">
                    <Avatar
                        src={getCurrentUserAvatar(user?.email)}
                        alt="Mi Perfil"
                        size="md"
                        className="border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => navigate("profile")}
                    />
                </div>

                <div className="mt-8 md:mt-0">
                    <WeekDisplay />
                </div>
            </header>

            {/* Grid de Tarjetas */}
            <main className="container mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {cleaners.map((cleaner) => {
                        const isMyCard = user?.email === cleaner.email;

                        return (
                            <TaskCard
                                key={cleaner.id}
                                name={cleaner.name}
                                avatarUrl={cleaner.avatarUrl}
                                taskName={cleaner.taskName}
                                isDone={cleaner.isDone}
                                completedAt={cleaner.completedAt}
                                colorTheme={cleaner.themeColor}
                                // Interactividad: Solo si es mi carta
                                isInteractive={isMyCard}
                                onToggle={() =>
                                    handleToggle(cleaner.username, cleaner.taskName)
                                }
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
