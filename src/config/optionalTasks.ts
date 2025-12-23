import type { OptionalTaskDef } from "@/types/domain";

export const OPTIONAL_TASKS: OptionalTaskDef[] = [
    {
        id: "dry_dishes",
        label: "Recoger Vajilla Seca",
        description:
            "Recoger todos los utensilios dejados en la zona de secado y limpiar la zona de secado",
        points: 5,
        frequency: "daily",
        maxPerPeriod: 1,
    },
    {
        id: "clean_glass",
        label: "Limpiar vitrocerámica",
        description: "Dejarla brillante usando el producto adecuado.",
        points: 3,
        frequency: "daily",
        maxPerPeriod: 1,
    },
    {
        id: "clean_living_table",
        label: "Limpiar mesa del salón",
        description: "Pasar bayeta y dejarla despejada.",
        points: 3,
        frequency: "daily",
        maxPerPeriod: 1,
    },
    {
        id: "wash_unknown_dishes",
        label: "Fregar lo de otros",
        description: "Fregar utensilios usados por alguien desconocido.",
        points: 3,
        frequency: "daily",
        maxPerPeriod: 1,
    },
    {
        id: "sweep_kitchen",
        label: "Suelo Cocina (Extra)",
        description: "Barrer/Fregar suelo cocina (si no es tu tarea).",
        points: 10,
        frequency: "weekly",
        maxPerPeriod: 2,
    },
    {
        id: "sweep_hall",
        label: "Suelo Pasillo (Extra)",
        description: "Barrer/Fregar suelo pasillo (si no es tu tarea).",
        points: 10,
        frequency: "weekly",
        maxPerPeriod: 1,
    },
    {
        id: "sweep_living",
        label: "Suelo Salón (Extra)",
        description: "Barrer/Fregar suelo salón (si no es tu tarea).",
        points: 10,
        frequency: "weekly",
        maxPerPeriod: 1,
    },
    {
        id: "deep_clean",
        label: "Limpieza General",
        description: "Limpiar toda la casa a fondo.",
        points: 35,
        frequency: "weekly",
        maxPerPeriod: 1,
    },
];
