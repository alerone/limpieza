import { Avatar } from "./Avatar";
import type { BrandColor } from "@/types/domain";
import { Badge } from "@/components/ui/badge"; // ✅ Recuperado
import { CheckCircle2, Circle, Clock, History } from "lucide-react"; // Añadido History para el icono de atrasado
import { cn } from "@/lib/utils";

interface TaskCardProps {
  name: string;
  avatarUrl: string;
  taskName: string;
  isDone: boolean;
  completedAt?: string | null;
  colorTheme: BrandColor;
  isLate?: boolean; // ✅ Nuevo prop
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
  isLate,
  isInteractive,
  onToggle,
}: TaskCardProps) {
  // 1. Lógica de Estilos Dinámicos
  let containerGlow = "border-white/10 hover:border-white/20 hover:shadow-lg";
  let badgeVariant: "default" | "outline" | "secondary" | "destructive" =
    "outline";
  let badgeClass = "text-muted-foreground border-white/20"; // Estilo por defecto (Pendiente)
  let statusText = "Pendiente";
  let StatusIcon = Circle;

  if (isDone) {
    StatusIcon = CheckCircle2;
    badgeVariant = "default";

    if (isLate) {
      // ESTADO: RECUPERADO (Azul)
      containerGlow =
        "border-blue-500/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]";
      badgeClass = "bg-blue-500 hover:bg-blue-600 border-0 text-white";
      statusText = "Recuperado";
    } else {
      // ESTADO: COMPLETADO A TIEMPO (Verde)
      containerGlow =
        "border-emerald-500/50 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]";
      badgeClass = "bg-emerald-600 hover:bg-emerald-600 border-0 text-white";
      statusText = "Completado";
    }
  }

  return (
    <div
      onClick={isInteractive ? onToggle : undefined}
      className={cn(
        "group relative flex flex-col p-5 rounded-2xl transition-all duration-300 border",
        // Estilos Base Glassmorphism
        "bg-zinc-900/40 backdrop-blur-xl",

        // Interactividad
        isInteractive
          ? "cursor-pointer hover:-translate-y-1 hover:bg-zinc-800/50"
          : "opacity-80 grayscale-[0.2]",

        // Glow dinámico según estado
        containerGlow,
      )}
    >
      {/* Indicador de estado visual (Icono flotante superior) */}
      <div
        className={cn(
          "absolute top-4 right-4 transition-all duration-300",
          isDone
            ? isLate
              ? "text-blue-400 scale-110"
              : "text-emerald-400 scale-110"
            : "text-muted-foreground/30 group-hover:text-muted-foreground/60",
        )}
      >
        <StatusIcon size={24} />
      </div>

      {/* Cabecera: Avatar y Nombre */}
      <div className="flex flex-col items-center gap-4 mt-2">
        <div
          className={cn(
            "rounded-full p-1 transition-all duration-500",
            isDone
              ? isLate
                ? "bg-gradient-to-tr from-blue-500/20 to-transparent"
                : "bg-gradient-to-tr from-emerald-500/20 to-transparent"
              : "",
          )}
        >
          <Avatar
            src={avatarUrl}
            alt={name}
            colorTheme={colorTheme}
            size="lg"
            className={cn(
              "transition-all duration-300",
              isDone
                ? "grayscale-0"
                : "grayscale-[0.3] group-hover:grayscale-0",
            )}
          />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {name}
          </h3>
          {/* Barra decorativa del color del usuario */}
          <div
            className={cn(
              "h-1 w-12 mx-auto rounded-full opacity-60",
              colorTheme === "blue" && "bg-sky-500",
              colorTheme === "green" && "bg-emerald-500",
              colorTheme === "purple" && "bg-purple-500",
              colorTheme === "yellow" && "bg-yellow-500",
              colorTheme === "pink" && "bg-pink-500",
            )}
          />
        </div>
      </div>

      {/* Contenido: Tarea */}
      <div className="mt-6 space-y-4">
        <div
          className={cn(
            "p-3 rounded-xl text-center font-bold text-lg transition-colors border",
            isDone
              ? isLate
                ? "bg-blue-500/10 border-blue-500/20 text-blue-200"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
              : "bg-white/5 border-white/5 text-white/80 group-hover:bg-white/10",
          )}
        >
          {taskName}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Badge
            variant={badgeVariant}
            className={cn("text-xs font-semibold px-3 py-1", badgeClass)}
          >
            {statusText}
          </Badge>

          {/* Hora de completado o indicador de histórico */}
          {isDone && completedAt && (
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium animate-in fade-in",
                isLate ? "text-blue-400/80" : "text-emerald-400/80",
              )}
            >
              {isLate ? <History size={12} /> : <Clock size={12} />}
              <span>{completedAt.split(" ")[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
