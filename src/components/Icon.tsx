type IconProps = {
    image: string,
    color?: Color,
    size: IconSize,
    className?: string,
    onClick?: () => void
}


const VERY_SMALL_SIZE = "xl:w-15 w-20 xl:h-15 h-20 border-4"
const SMALL_SIZE = "xl:w-20 w-25 xl:h-20 h-25 border-4"
const MEDIUM_SIZE = "z-30 xl:w-25 w-15 xl:h-25 h-15 border-4"
const BIG_SIZE = "xl:w-60 w-25 xl:h-60 h-25 border-4 xl:border-8"

export type IconSize = "very_small" | "small" | "medium" | "big"
export type Color = "blue" | "green" | "purple" | "yellow" | "pink"
const sizes = { "very_small": VERY_SMALL_SIZE, "small": SMALL_SIZE, "medium": MEDIUM_SIZE, "big": BIG_SIZE }

const borderColors = {
    "blue": `border-sky-400`,
    "green": `border-emerald-400`,
    "purple": `border-purple-400`,
    "yellow": `border-yellow-400`,
    "pink": `border-pink-400`
}

export function Icon({ image, onClick, color, size, className }: IconProps) {
    return (
        <img
            className={`${sizes[size]} rounded-full ${color ? borderColors[color] : "border-transparent"} ${onClick && "hover:scale-105 hover:cursor-pointer"} transition-all duration-200 ${className}`}
            src={image}
            alt=""
            onClick={onClick}
        />

    )
}
