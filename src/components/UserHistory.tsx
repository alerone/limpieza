import type { HistoryItem } from "@/hooks/useHistory";
import { AlertTriangle, CalendarOff, CheckCircle2 } from "lucide-react";

export function UserHistory({ history }: { history: HistoryItem[] }) {
  const hasDebts = history.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto animate-in slide-in-from-bottom-5 duration-700 delay-100">
      {/* Cabecera de la Sección */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          {hasDebts ? (
            <>
              <AlertTriangle className="text-status-pending" />
              <span>Historial de Pendientes</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="text-status-success" />
              <span>Historial Impecable</span>
            </>
          )}
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {hasDebts
            ? `Tienes ${history.length} semanas marcadas como no completadas.`
            : "¡Todo al día! No debes ninguna tarea."}
        </p>
      </div>

      {/* Lista de Deudas (Glassmorphism) */}
      {hasDebts ? (
        <div className="flex flex-col gap-3">
          {history.map((item, index) => (
            <div
              key={item.week}
              className="group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center  gap-4">
                <div className="p-2 bg-rose-500/20 rounded-full text-rose-400 group-hover:scale-110 transition-transform">
                  <CalendarOff size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-200">{item.task}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    Semana {item.week}
                  </span>
                </div>
              </div>

              {/* Badge visual */}
              <span className="ml-1 px-0.5 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                No hecho
              </span>
            </div>
          ))}
        </div>
      ) : (
        // Estado Vacío (Empty State)
        <div className="flex flex-col items-center justify-center py-12 bg-white/5 border border-white/10 border-dashed rounded-2xl">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-gray-300 font-medium">Estás libre de pecado</p>
          <p className="text-xs text-gray-500">Sigue así, máquina.</p>
        </div>
      )}
    </div>
  );
}
