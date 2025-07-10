import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import {
    get,
    orderByKey,
    onValue,
    limitToLast,
    query,
    update,
    ref,
    set,
    push,
} from 'firebase/database'
import { getWeekOfYear } from './models.js'
import { getPreciseDateString, getWeekBounds } from './utils.js'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export class FirebaseService {
    constructor() {
        this.app = app
        this.db = db
        this.path = 'piso'
    }

    insert(user, data) {
        set(ref(db, this.path + user), data)
    }

    async initWeek(usuarios) {
        const weekNumber = getWeekOfYear()
        const today = new Date()
        const week = getWeekBounds(today)
        const year = today.getFullYear()

        const fechasRef = ref(db, this.path)
        const ultimaEntradaQuery = query(fechasRef, orderByKey(), limitToLast(1))

        const snapshot = await get(ultimaEntradaQuery)

        let debeGuardar = true

        if (snapshot.exists()) {
            const ultimoDato = Object.values(snapshot.val())[0]

            if (ultimoDato.year == year && ultimoDato.week == weekNumber) {
                debeGuardar = false
            }
        }

        if (debeGuardar) {
            const nuevoRegistro = push(fechasRef)
            await set(nuevoRegistro, {
                year: year,
                weekNumber: weekNumber,
                week: week,
                usuarios: usuarios,
            })
        }
    }

    async listenToUser(userId, callback) {
        const idRegistro = await obtenerUltimoIdRegistro()
        const userRef = ref(db, `piso/${idRegistro}/usuarios/${userId}`)


        onValue(userRef, (snapshot) => {
            if (snapshot) {
                const data = snapshot.val().done
                callback(data)
            } else {
                console.error(`no snapshot for ${userId} found`)
                this.initWeek()
            }
        })
    }

    async toggleDone(usuarioKey) {
        const idRegistro = await obtenerUltimoIdRegistro()

        if (!idRegistro) {
            console.error('❌ No hay registros en la base de datos.')
            return
        }

        const usuarioRef = ref(db, `piso/${idRegistro}/usuarios/${usuarioKey}`)
        const snapshot = await get(usuarioRef)

        if (!snapshot.exists()) {
            console.error(`❌ El usuario ${usuarioKey} no existe en el último registro.`)
            return
        }

        const usuario = snapshot.val()
        const nuevoEstado = !usuario.done

        const hoy = getPreciseDateString()
        const nuevaFecha = nuevoEstado ? hoy : 'not done'

        await update(usuarioRef, { done: nuevoEstado, fecha: nuevaFecha })
    }
}

const obtenerUltimoIdRegistro = async () => {
    const fechasRef = ref(db, 'piso')
    const q = query(fechasRef, orderByKey(), limitToLast(1))
    const snapshot = await get(q)

    if (snapshot.exists()) {
        const data = snapshot.val()
        const [idRegistro] = Object.keys(data)
        return idRegistro
    }

    return null
}
