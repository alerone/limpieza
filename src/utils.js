export function getPreciseDateString() {
    const hoy = new Date()
    const dia = String(hoy.getDate()).padStart(2, '0')
    const mes = String(hoy.getMonth() + 1).padStart(2, '0') // Los meses van de 0 a 11
    const año = hoy.getFullYear()
    const hora = hoy.getHours()
    const minutos = hoy.getMinutes()

    return `${dia}/${mes}/${año} ${hora}:${minutos}`
}

export function getDayString(date) {
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0') // Los meses van de 0 a 11
    const año = date.getFullYear()

    return `${dia}/${mes}/${año}`
}

export function getWeekBounds(date) {
    const current = new Date(date);
    const day = current.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(current);
    monday.setDate(current.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${getDayString(monday)} - ${getDayString(sunday)}`
}
