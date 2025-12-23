import type { ReactNode } from "react";

interface BackgroundWrapperProps {
    children: ReactNode;
}

export function BackgroundWrapper({ children }: BackgroundWrapperProps) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background">
            {/* CAPA 1: Fondo Oscuro Base (Zinc 950 ya definido en index.css) */}

            {/* CAPA 2: Grid de Iconos en Movimiento (SVG Pattern) */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 h-[200%] w-[200%] animate-scrolling-grid bg-[url('/grid-pattern.svg')]">
                    {/* Usaremos un componente SVG inline para no depender de archivos externos si prefieres, 
               o generamos el patrón aquí mismo. Mira abajo la implementación inline para máxima portabilidad. */}
                    <CleaningGridPattern />
                </div>
            </div>

            {/* CAPA 3: Gradiente Radial para dar profundidad (Vignette) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-background via-transparent to-background/80 pointer-events-none" />

            {/* CAPA 4: Contenido de la App */}
            <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
        </div>
    );
}

// Componente interno que dibuja el patrón SVG repetitivo
function CleaningGridPattern() {
    // Definimos el tamaño del "azulejo" (tile) del patrón
    const size = 60;

    return (
        <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern
                    id="cleaning-icons"
                    x="0"
                    y="0"
                    width={size}
                    height={size}
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(0)"
                >
                    {/* Iconos vectoriales simplificados (Paths de Lucide) */}
                    {/* Color: Fill currentColor (blanco) para reaccionar a la opacidad del padre */}

                    {/* 1. Sparkles (Brillitos) - Top Left */}
                    <path
                        d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                        fill="currentColor"
                        transform="translate(4, 4) scale(0.4)"
                    />

                    {/* 2. Feather/Duster (Plumero) - Bottom Right */}
                    <path
                        d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z M16 8L2 22"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        transform="translate(30, 30) scale(0.5)"
                    />

                    {/* 3. Spray (Spray) - Top Right */}
                    <path
                        d="M3 3h.01 M7 5h.01 M11 7h.01 M3 7h.01 M7 3h.01 M11 3h.01 M15 5h4l-2 3h3l-8 13-2-6h-3l2-10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        transform="translate(32, 2) scale(0.5)"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cleaning-icons)" />
        </svg>
    );
}
