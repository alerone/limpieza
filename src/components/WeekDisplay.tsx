import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeekDisplayProps {
  currentWeekStr: string; // "12/05-18/05"
  onPrev: () => void;
  onNext: () => void;
  isCurrentWeek: boolean; // Para deshabilitar botón 'Next' si ya estamos en la actual
}

export function WeekDisplay({
  currentWeekStr,
  onPrev,
  onNext,
  isCurrentWeek,
}: WeekDisplayProps) {
  const [start, end] = currentWeekStr.split("-");

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <CalendarDays size={14} />
        <span>Semana de Limpieza</span>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft size={32} />
        </Button>

        <div className="flex flex-col items-center">
          <div className="flex flex-col md:flex-row items-baseline gap-2 md:gap-4">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 tracking-tight">
              {start}
            </h2>
            <span className="text-xl text-muted-foreground/50 font-light hidden md:inline">
              —
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 tracking-tight">
              {end}
            </h2>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={isCurrentWeek}
          className={`text-white hover:bg-white/10 ${isCurrentWeek ? "opacity-0 pointer-events-none" : ""}`}
        >
          <ChevronRight size={32} />
        </Button>
      </div>
    </div>
  );
}
