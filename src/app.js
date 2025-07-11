import { auth, handleLogout } from './auth.js'
import { getDayString, getWeekBounds } from './utils.js'
import { UserModel, CleaningModel } from './models.js'
import { FirebaseService } from './firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

let currentUser = undefined
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "/limpieza/"
    } else {
        currentUser = user
    }
})

const emails = {
    alvaro: import.meta.env.VITE_EMAIL_ALVARO,
    rubius: import.meta.env.VITE_EMAIL_RUBIUS,
    victor: import.meta.env.VITE_EMAIL_VICTOR,
    alex: import.meta.env.VITE_EMAIL_ALEX,
}

const users = {
    "alvaro": new UserModel('Álvaro', emails.alvaro),
    "ruben": new UserModel('Rubén', emails.rubius),
    "victor": new UserModel('Víctor', emails.victor),
    "alex": new UserModel('Álex', emails.alex),
}

const cleaningModel = new CleaningModel(users)
const firebaseService = new FirebaseService()

const alvaroTask = document.querySelector('#alvaroTask')
const alexTask = document.querySelector('#alexTask')
const victorTask = document.querySelector('#victorTask')
const rubiuTask = document.querySelector('#rubiuTask')

const dayLabel = document.querySelector('#diaLabel')
const semanaLabel = document.querySelector('#semanaLabel')

const alvaroContainer = document.querySelector('#alvaroCard')
const victorContainer = document.querySelector('#victorCard')
const alexContainer = document.querySelector('#alexCard')
const rubiusContainer = document.querySelector('#rubiusCard')

const rubiusBorder = document.querySelector('#rubiusBorder')
const alvaroBorder = document.querySelector('#alvaroBorder')
const alexBorder = document.querySelector('#alexBorder')
const victorBorder = document.querySelector('#victorBorder')

const logoutBtn = document.querySelector('#logoutBtn')

logoutBtn.addEventListener("click", handleLogout)

const tasks = cleaningModel.getTaskOrder()

const usuarios = {
    rubius: { nombre: 'Rubiu', done: false, fecha: 'not done' },
    alvaro: { nombre: 'Álvaro', done: false, fecha: 'not done' },
    victor: { nombre: 'Víctor', done: false, fecha: 'not done' },
    alex: { nombre: 'Alex', done: false, fecha: 'not done' },
}

firebaseService.initWeek(usuarios)
setInterval(() => firebaseService.initWeek(usuarios), 5 * 60 * 1000)

alvaroContainer.addEventListener('click', async () => {
    if (currentUser.email == users["alvaro"].email)
        await firebaseService.toggleDone('alvaro')
})
victorContainer.addEventListener('click', async () => {
    if (currentUser.email == users["victor"].email)
        await firebaseService.toggleDone('victor')
})
alexContainer.addEventListener('click', async () => {
    if (currentUser.email == users["alex"].email)
        await firebaseService.toggleDone('alex')
})
rubiusContainer.addEventListener('click', async () => {
    if (currentUser.email == users["ruben"].email)
        await firebaseService.toggleDone('rubius')
})

firebaseService.listenToUser('alvaro', (val) => {
    changeBorderColor(alvaroBorder, val)
})
firebaseService.listenToUser('rubius', (val) => {
    changeBorderColor(rubiusBorder, val)
})
firebaseService.listenToUser('victor', (val) => {
    changeBorderColor(victorBorder, val)
})
firebaseService.listenToUser('alex', (val) => {
    changeBorderColor(alexBorder, val)
})

alvaroTask.textContent = tasks[1]
alexTask.textContent = tasks[3]
victorTask.textContent = tasks[2]
rubiuTask.textContent = tasks[0]

// Date labels
const today = new Date()
dayLabel.textContent = `DIA: ${getDayString(today)}`
semanaLabel.innerHTML = `SEMANA:<br>${getWeekBounds(today)}`

function changeBorderColor(element, isDone) {
    if (isDone) {
        element.classList.add('from-green-400')
        element.classList.add('to-emerald-500')
        element.classList.remove('from-red-500')
        element.classList.remove('to-red-700')
    } else {
        element.classList.remove('from-green-400')
        element.classList.remove('to-emerald-500')
        element.classList.add('from-red-500')
        element.classList.add('to-red-700')
    }
}
