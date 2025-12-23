import { useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { useTitle } from "@/hooks/useTitle";
import {
    useRecentLogs,
    useOptionalTasksTracking,
} from "@/hooks/useGamification";
import {
    claimOptionalTask,
    unclaimOptionalTask,
} from "@/services/pointsService";
import { OPTIONAL_TASKS } from "@/config/optionalTasks";
import { CLEANERS } from "@/config/cleaners";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Coins, History, Undo2 } from "lucide-react";

export default function OptionalTasksPage() {
    useTitle("Misiones Extra - CleanApp");
    const { user } = useAuth();
    const { logs, loading: logsLoading } = useRecentLogs();
    const trackingCounts = useOptionalTasksTracking();

    // Usuario actual (CleanerProfile)
    const currentUser = Object.values(CLEANERS).find(
        (c) => c.email === user?.email,
    );
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleClaim = async (task: (typeof OPTIONAL_TASKS)[0]) => {
        if (!currentUser) return;
        setProcessingId(task.id);

        try {
            const result = await claimOptionalTask(
                currentUser,
                task.id,
                task.label,
                task.points,
                task.frequency,
                task.maxPerPeriod,
            );

            if (!result.success) {
                alert(result.message); // Simple alert por ahora
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleUndo = async (task: (typeof OPTIONAL_TASKS)[0]) => {
        if (!currentUser) return;
        if (
            !confirm(
                `¿Borrar registro de "${task.label}" y devolver los ${task.points} puntos?`,
            )
        )
            return;

        setProcessingId(task.id);
        try {
            const res = await unclaimOptionalTask(
                currentUser,
                task.id,
                task.label,
                task.points,
                task.frequency,
            );
            if (!res.success) alert(res.message);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            {/* Header */}
            <header className="mt-6 px-4">
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <Coins className="text-yellow-400" />
                    Misiones Extra
                </h1>
                <p className="text-gray-400 mt-1 text-sm">
                    Gana puntos extra para escalar en el ranking.
                </p>
            </header>

            <section className="px-4 grid gap-4 grid-cols-1 md:grid-cols-2">
                {OPTIONAL_TASKS.map((task) => {
                    // Datos del hook actualizado
                    const taskInfo = trackingCounts[task.id] || {
                        totalCount: 0,
                        userCount: {},
                    };
                    const totalCount = taskInfo.totalCount;
                    const myCount = currentUser
                        ? taskInfo.userCount[currentUser.username] || 0
                        : 0;

                    const isMaxed = totalCount >= task.maxPerPeriod;
                    const canUndo = myCount > 0; // Si yo la he hecho, puedo deshacer

                    return (
                        <div
                            key={task.id}
                            className={`
                                relative p-4 rounded-xl border transition-all flex flex-col
                                ${isMaxed
                                    ? "bg-zinc-900/50 border-white/5"
                                    : "bg-zinc-900 border-white/10"
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <Badge
                                    variant="outline"
                                    className="border-indigo-500/30 text-indigo-300"
                                >
                                    {task.frequency === "daily" ? "Diaria" : "Semanal"}
                                </Badge>
                                <span className="font-bold text-yellow-400 text-lg">
                                    +{task.points} pts
                                </span>
                            </div>

                            <h3 className="font-bold text-white text-lg">{task.label}</h3>
                            <p className="text-sm text-gray-400 mb-4">{task.description}</p>

                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>
                                        Global: {totalCount}/{task.maxPerPeriod}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Botón DESHACER (Solo si tengo claims) */}
                                    {canUndo && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleUndo(task)}
                                            disabled={!!processingId}
                                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/20 h-8 px-2"
                                            title="Deshacer mi último registro"
                                        >
                                            <Undo2 size={16} />
                                        </Button>
                                    )}

                                    {/* Botón RECLAMAR */}
                                    {!isMaxed && (
                                        <Button
                                            size="sm"
                                            disabled={!!processingId}
                                            onClick={() => handleClaim(task)}
                                            className="bg-indigo-600 hover:bg-indigo-500 h-8"
                                        >
                                            {processingId === task.id ? "..." : "Reclamar"}
                                        </Button>
                                    )}

                                    {/* Indicador de Completo */}
                                    {isMaxed && !canUndo && (
                                        <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
                                            <Check size={16} /> Hecho
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Log de Actividad Global */}
            <section className="px-4 mt-6">
                <div className="flex items-center gap-2 mb-4 text-white">
                    <History className="text-gray-400" />
                    <h2 className="font-bold text-lg">Actividad Reciente</h2>
                </div>

                <div className="bg-black/20 rounded-xl border border-white/5 p-4 space-y-4 max-h-[400px] overflow-y-auto">
                    {logsLoading ? (
                        <p className="text-gray-500 text-center text-sm">
                            Cargando actividad...
                        </p>
                    ) : logs.length === 0 ? (
                        <p className="text-gray-500 text-center text-sm py-4">
                            No hay actividad reciente.
                        </p>
                    ) : (
                        logs.map((log) => (
                            <div
                                key={log.id}
                                className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2"
                            >
                                <Avatar
                                    src={log.userAvatar}
                                    alt={log.userName}
                                    size="sm"
                                    className="w-8 h-8 md:w-10 md:h-10 border" // Override size
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm font-bold text-white truncate mr-2">
                                            {log.userName}
                                        </span>
                                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 truncate">
                                        {log.description}
                                    </p>
                                </div>
                                <div
                                    className={`text-xs font-bold whitespace-nowrap ${log.pointsDelta > 0 ? "text-emerald-400" : "text-rose-400"}`}
                                >
                                    {log.pointsDelta > 0 ? "+" : ""}
                                    {log.pointsDelta} pts
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
