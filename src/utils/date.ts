export function getPreciseDateString() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
  const year = today.getFullYear();
  const hour = today.getHours();
  const minutes = today.getMinutes();

  return `${day}/${month}/${year} ${hour}:${minutes}`;
}
export function getDayString(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// ... imports anteriores

// Modificamos getWeekBounds para aceptar una fecha opcional (por defecto hoy)
export function getWeekBounds(date: Date = new Date()) {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return `${getDayString(monday)}-${getDayString(sunday)}`;
}

// Retorna: 0 (Actual), <0 (Pasado), >0 (Futuro), -1 (Exactamente la anterior)
export function compareWeeks(
  targetWeekId: string,
  currentWeekId: string = getWeekBounds(),
) {
  // Truco: Extraemos la fecha de inicio del string "12/05/2025-..."
  // Asumimos formato DD/MM/YYYY
  const parseWeekStart = (weekId: string) => {
    const startStr = weekId.split("-")[0]; // "12/05/2025"
    const [d, m, y] = startStr.split("/").map(Number);
    return new Date(y, m - 1, d).getTime();
  };

  // NOTA: Tu sanitize usa "_" en paths, pero la logica de UI usa "/".
  // Asegurémonos de normalizar antes de parsear si viene con "_"
  const normalize = (w: string) => w.replaceAll("_", "/");

  const t = parseWeekStart(normalize(targetWeekId));
  const c = parseWeekStart(normalize(currentWeekId));

  if (t === c) return 0; // Misma semana

  // Diferencia en milisegundos de una semana = 604800000
  const diff = c - t;
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  // Si la diferencia es aprox una semana (aceptamos margen de 1 hora por cambios de hora)
  if (diff > oneWeekMs - 3600000 && diff < oneWeekMs + 3600000) return -1; // Es la anterior inmediata

  return t < c ? -2 : 1; // -2 (muy vieja), 1 (futura)
}

// Helper para sumar/restar semanas a una fecha
export function addWeeks(date: Date, weeks: number) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + weeks * 7);
  return newDate;
}

export function getWeekOfYear() {
  const date = new Date();
  // Creamos una copia de la fecha y la ajustamos a medianoche
  const target = new Date(date.valueOf());
  target.setHours(0, 0, 0, 0);

  // ISO-8601: el lunes es el primer día de la semana.
  // Calculamos el jueves de la semana actual
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);

  // Obtenemos el primer jueves del año
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstDayNr = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDayNr + 3);

  // Calculamos la diferencia en semanas
  const weekNumber =
    1 +
    Math.round(
      (target.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000),
    );
  return weekNumber;
}

export function getMonday() {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  return monday;
}

export function parseWeekId(weekId: string): Date {
  const startStr = weekId.split("-")[0];
  const [d, m, y] = startStr.split("/").map(Number);
  return new Date(y, m - 1, d);
}
