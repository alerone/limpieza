import { Avatar } from "./Avatar";
import type { BrandColor } from "@/types/domain";

interface TaskCardProps {
  name: string;
  avatarUrl: string;
  taskName: string;
  isDone: boolean;
  completedAt?: string | null;
  colorTheme: BrandColor;
  isInteractive: boolean;
  onToggle: () => void;
}

export function TaskCard({
  name,
  avatarUrl,
  taskName,
  isDone,
  completedAt,
  colorTheme,
  isInteractive,
  onToggle,
}: TaskCardProps) {
  // Clases dinámicas basadas en estado
  const statusBadgeClass = isDone
    ? "bg-emerald-500 text-white"
    : "bg-rose-500 text-white";

  return (
    <article
      onClick={isInteractive ? onToggle : undefined}
      className={`
        flex flex-col justify-between p-4 rounded-xl shadow-lg transition-all duration-300 bg-white
        ${isInteractive ? "cursor-pointer hover:scale-105 hover:shadow-xl" : "opacity-90"}
      `}
    >
      {/* Cabecera Usuario */}
      <div className="flex flex-col items-center gap-2">
        <Avatar src={avatarUrl} alt={name} colorTheme={colorTheme} size="md" />
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <div className="h-1 w-full bg-gray-200 rounded-full" />
      </div>

      {/* Cuerpo Tarea */}
      <div className="mt-4 flex flex-col gap-3">
        <div
          className={`
           p-2 rounded-lg text-center font-bold text-xl shadow-sm text-gray-800
           bg-gradient-to-r from-orange-200 to-orange-300
        `}
        >
          {taskName}
        </div>

        <div className="flex justify-end items-center gap-2">
          {isDone && completedAt && (
            <span className="text-xs font-semibold text-emerald-600">
              {completedAt}
            </span>
          )}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${statusBadgeClass}`}
          >
            {isDone ? "Hecho" : "Pendiente"}
          </span>
        </div>
      </div>
    </article>
  );
}
