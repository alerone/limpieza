export function getDayString() {
    const hoy = new Date()
    const dia = String(hoy.getDate()).padStart(2, '0')
    const mes = String(hoy.getMonth() + 1).padStart(2, '0') // Los meses van de 0 a 11
    const año = hoy.getFullYear()
    const hora = hoy.getHours()
    const minutos = hoy.getMinutes()

    return `${dia}/${mes}/${año} ${hora}:${minutos}`
}
