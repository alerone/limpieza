import { useWeekTracker } from "@/hooks/useWeekTracker";
import { CalendarDays } from "lucide-react";

export function WeekDisplay({ className }: { className?: string }) {
    const week = useWeekTracker();

    // Formato: "12/05 - 18/05" (aprovechamos tu util)
    const [start, end] = week.split("-");

    return (
        <div
            className={`flex flex-col items-center justify-center space-y-2 ${className}`}
        >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <CalendarDays size={14} />
                <span>Semana Actual</span>
            </div>

            <div className="flex flex-col md:flex-row items-baseline gap-2 md:gap-4">
                <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 tracking-tight">
                    {start}
                </h2>
                <span className="text-2xl text-muted-foreground/50 font-light hidden md:inline">
                    —
                </span>
                <div className="w-8 h-[1px] bg-white/20 md:hidden my-1"></div>
                <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 tracking-tight">
                    {end}
                </h2>
            </div>
        </div>
    );
}
