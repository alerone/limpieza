import type { BrandColor } from "@/types/domain";

interface AvatarProps {
    src: string;
    alt: string;
    colorTheme?: BrandColor;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    onClick?: () => void;
}

// Mapeo de tamaños a clases Tailwind
const SIZES = {
    sm: "w-12 h-12 border-2",
    md: "w-20 h-20 border-4",
    lg: "w-32 h-32 border-4",
    xl: "w-48 h-48 border-8",
};

// Mapeo de colores a bordes (usando nombres de colores Tailwind estándar)
const BORDERS: Record<BrandColor, string> = {
    blue: "border-sky-400",
    green: "border-emerald-400",
    purple: "border-purple-400",
    yellow: "border-yellow-400",
    pink: "border-pink-400",
};

export function Avatar({
    src,
    alt,
    colorTheme = "blue",
    size = "md",
    className = "",
    onClick,
}: AvatarProps) {
    return (
        <img
            src={src}
            alt={alt}
            onClick={onClick}
            className={`
        rounded-full object-cover transition-transform duration-200
        ${SIZES[size]} 
        ${BORDERS[colorTheme]}
        ${onClick ? "cursor-pointer hover:scale-105" : ""}
        ${className}
      `}
        />
    );
}
