export function getDayString() {
    const hoy = new Date()
    const dia = hoy.getDay()
    const mes = hoy.getMonth()
    const año = hoy.getFullYear()
    const hora = hoy.getHours()
    const minutos = hoy.getMinutes()

    return `${dia}/${mes}/${año} ${hora}:${minutos}`
}
