export function getPreciseDateString() {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0') // Los meses van de 0 a 11
    const year = today.getFullYear()
    const hour = today.getHours()
    const minutes = today.getMinutes()

    return `${day}/${month}/${year} ${hour}:${minutes}`
}
export function getDayString(date: Date) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Los meses van de 0 a 11
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
}

export function getWeekBounds(current: Date = new Date()) {
    const day = current.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(current);
    monday.setDate(current.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${getDayString(monday)}-${getDayString(sunday)}`
}

export function getWeekOfYear() {
    const date = new Date()
    // Creamos una copia de la fecha y la ajustamos a medianoche
    const target = new Date(date.valueOf())
    target.setHours(0, 0, 0, 0)

    // ISO-8601: el lunes es el primer día de la semana.
    // Calculamos el jueves de la semana actual
    const dayNr = (date.getDay() + 6) % 7
    target.setDate(target.getDate() - dayNr + 3)

    // Obtenemos el primer jueves del año
    const firstThursday = new Date(target.getFullYear(), 0, 4)
    const firstDayNr = (firstThursday.getDay() + 6) % 7
    firstThursday.setDate(firstThursday.getDate() - firstDayNr + 3)

    // Calculamos la diferencia en semanas
    const weekNumber = 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000))
    return weekNumber
}


export function getMonday() {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    return monday
}



