import { useState } from "react";
import { useRanking, type RankingItem } from "@/hooks/useRanking";
import { useTitle } from "@/hooks/useTitle";
import { Avatar } from "@/components/ui/Avatar";
import { Trophy, Coins, CalendarDays, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils"; // Utilidad de Shadcn para clases condicionales

type RankingMode = "weeks" | "points";

export default function RankingPage() {
    useTitle("Ranking - CleanApp");
    const { ranking, loading } = useRanking();
    const [mode, setMode] = useState<RankingMode>("weeks");

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <Sparkles className="text-white/20" size={48} />
                    <p className="text-gray-400 font-medium">Calculando ganadores...</p>
                </div>
            </div>
        );
    }

    // Lógica de Ordenación Dinámica
    const sortedRanking = [...ranking].sort((a, b) => {
        if (mode === "weeks") return b.weeks - a.weeks;
        return b.points - a.points;
    });

    const [top1, top2, top3, ...rest] = sortedRanking;

    // Configuración visual según el modo
    const theme = {
        weeks: {
            color: "text-yellow-400",
            bgIcon: "bg-yellow-500/10 ring-yellow-500/20",
            gradient: "from-yellow-100 via-yellow-400 to-yellow-600",
            icon: <Trophy size={32} />,
            label: "Semanas Cumplidas",
            unit: (val: number) => (val === 1 ? "Semana" : "Semanas"),
        },
        points: {
            color: "text-indigo-400",
            bgIcon: "bg-indigo-500/10 ring-indigo-500/20",
            gradient: "from-indigo-100 via-indigo-400 to-indigo-600",
            icon: <Coins size={32} />,
            label: "Puntos Totales",
            unit: () => "Pnts",
        },
    }[mode];

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header con Toggle */}
            <header className="flex flex-col items-center gap-6 mt-4">
                {/* Toggle Switch */}
                <div className="flex p-1 bg-zinc-900/80 border border-white/10 rounded-full relative">
                    {/* Fondo animado del toggle */}
                    <div
                        className={cn(
                            "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 bg-white/10 border border-white/5 shadow-sm",
                            mode === "weeks" ? "left-1" : "left-[calc(50%+4px)]",
                        )}
                    />

                    <button
                        onClick={() => setMode("weeks")}
                        className={cn(
                            "relative z-10 flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-colors",
                            mode === "weeks"
                                ? "text-white"
                                : "text-gray-500 hover:text-gray-300",
                        )}
                    >
                        <CalendarDays size={16} />
                        Semanas
                    </button>
                    <button
                        onClick={() => setMode("points")}
                        className={cn(
                            "relative z-10 flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-colors",
                            mode === "points"
                                ? "text-white"
                                : "text-gray-500 hover:text-gray-300",
                        )}
                    >
                        <Coins size={16} />
                        Puntos
                    </button>
                </div>

                {/* Título y Icono Animado */}
                <div
                    className="text-center space-y-2 animate-in fade-in zoom-in-95 duration-300"
                    key={mode}
                >
                    <div
                        className={`inline-flex p-3 rounded-full mb-2 ring-1 shadow-[0_0_20px_rgba(255,255,255,0.1)] ${theme.bgIcon} ${theme.color}`}
                    >
                        {theme.icon}
                    </div>
                    <h1
                        className={`text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br ${theme.gradient} tracking-tight`}
                    >
                        {mode === "weeks" ? "Salón de la Fama" : "Ranking de Puntos"}
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
                        {theme.label}
                    </p>
                </div>
            </header>

            {/* PODIO */}
            <div className="flex justify-center items-end gap-3 md:gap-8 mt-4 px-2 min-h-[320px]">
                {top2 && <PodiumStep user={top2} place={2} delay={200} mode={mode} />}
                {top1 && <PodiumStep user={top1} place={1} delay={0} mode={mode} />}
                {top3 && <PodiumStep user={top3} place={3} delay={400} mode={mode} />}
            </div>

            {/* Lista Resto */}
            {rest.length > 0 && (
                <div className="max-w-xl mx-auto w-full flex flex-col gap-3 mt-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2 mb-1">
                        Resto de Mortales
                    </h3>
                    {rest.map((user, index) => {
                        const value = mode === "weeks" ? user.weeks : user.points;
                        return (
                            <div
                                key={user.id}
                                className="group flex items-center gap-4 p-3 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-white/10 hover:bg-zinc-800/50 transition-all animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards"
                                style={{ animationDelay: `${(index + 3) * 100}ms` }}
                            >
                                <div className="font-bold text-gray-600 w-6 text-center text-sm">
                                    #{index + 4}
                                </div>
                                <Avatar
                                    src={user.avatarUrl}
                                    alt={user.name}
                                    size="sm"
                                    colorTheme={user.themeColor}
                                    className="grayscale group-hover:grayscale-0 transition-all"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">
                                        {user.name}
                                    </h3>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <span className="block text-lg font-bold text-white leading-none">
                                        {value}
                                    </span>
                                    <span className="text-[10px] uppercase font-medium text-gray-500">
                                        {theme.unit(value)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Subcomponente Podium
function PodiumStep({
    user,
    place,
    delay,
    mode,
}: {
    user: RankingItem;
    place: number;
    delay: number;
    mode: RankingMode;
}) {
    const value = mode === "weeks" ? user.weeks : user.points;
    const label =
        mode === "weeks" ? (value === 1 ? "Semana" : "Semanas") : "Puntos";

    // Estilos dinámicos según modo y puesto
    const isPoints = mode === "points";

    const config = {
        1: {
            height: "h-[240px]",
            // Si es puntos usa indigo, si es semanas usa yellow
            color: isPoints
                ? "from-indigo-500/20 to-indigo-600/5"
                : "from-yellow-500/20 to-yellow-600/5",
            border: isPoints ? "border-indigo-500/30" : "border-yellow-500/30",
            text: isPoints ? "text-indigo-400" : "text-yellow-400",
        },
        2: {
            height: "h-[180px]",
            color: "from-slate-400/20 to-slate-500/5",
            border: "border-slate-400/30",
            text: "text-slate-300",
        },
        3: {
            height: "h-[150px]",
            color: "from-orange-500/20 to-orange-600/5",
            border: "border-orange-500/30",
            text: "text-orange-400",
        },
    }[place];

    return (
        <div
            className={`flex flex-col items-center justify-end w-1/3 max-w-[130px] animate-in slide-in-from-bottom-10 fade-in duration-1000 fill-mode-backwards`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="mb-[-25px] z-10 relative group cursor-pointer">
                <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    size={place === 1 ? "lg" : "md"}
                    colorTheme={user.themeColor}
                    className={`shadow-2xl transition-transform duration-300 group-hover:-translate-y-2`}
                />
                {place === 1 && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
                        {isPoints ? (
                            <Coins
                                className="text-indigo-400 fill-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                size={28}
                            />
                        ) : (
                            <Trophy
                                className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                size={28}
                            />
                        )}
                    </div>
                )}
            </div>

            <div
                className={`w-full ${config?.height} bg-gradient-to-t ${config?.color} rounded-t-2xl border-t border-x ${config?.border} backdrop-blur-sm flex flex-col items-center justify-start pt-10 pb-4 relative overflow-hidden transition-colors duration-500`}
            >
                <h3
                    className={`font-bold text-sm md:text-lg truncate max-w-full px-1 ${place === 1 ? "text-white" : "text-gray-300"}`}
                >
                    {user.name}
                </h3>
                <div className="mt-1 flex flex-col items-center">
                    <span
                        className={`text-2xl md:text-4xl font-black ${config?.text} drop-shadow-sm`}
                    >
                        {value}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-medium text-white/40">
                        {label}
                    </span>
                </div>
                <div
                    className={`absolute bottom-[-10px] font-black text-6xl opacity-5 select-none pointer-events-none ${config?.text}`}
                >
                    {place}
                </div>
            </div>
        </div>
    );
}
