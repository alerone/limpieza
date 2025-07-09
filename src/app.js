import { auth, getUser, handleLogout } from './auth.js'
import { UserModel, CleaningModel } from './models.js'
import { FirebaseService } from './firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
let currentUser = undefined
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html"
    } else {
        currentUser = user
    }
})


const users = [
    new UserModel('Álvaro', "lopezalvarezalvaro1@gmail.com"),
    new UserModel('Rubén'),
    new UserModel('Joan'),
    new UserModel('Álex'),
]

const cleaningModel = new CleaningModel(users)
const firebaseService = new FirebaseService()

const alvaroTask = document.querySelector('#alvaroTask')
const alexTask = document.querySelector('#alexTask')
const joanTask = document.querySelector('#joanTask')
const rubiuTask = document.querySelector('#rubiuTask')

const dayLabel = document.querySelector('#diaLabel')
const semanaLabel = document.querySelector('#semanaLabel')

const alvaroContainer = document.querySelector('#alvaroCard')
const joanContainer = document.querySelector('#joanCard')
const alexContainer = document.querySelector('#alexCard')
const rubiusContainer = document.querySelector('#rubiusCard')

const rubiusBorder = document.querySelector('#rubiusBorder')
const alvaroBorder = document.querySelector('#alvaroBorder')
const alexBorder = document.querySelector('#alexBorder')
const joanBorder = document.querySelector('#joanBorder')

const logoutBtn = document.querySelector('#logoutBtn')

logoutBtn.addEventListener("click", handleLogout)

const tasks = cleaningModel.getTaskOrder()

const usuarios = {
    usuario0: { nombre: 'Rubiu', done: false, fecha: 'not done' },
    usuario1: { nombre: 'Álvaro', done: false, fecha: 'not done' },
    usuario2: { nombre: 'Joan', done: false, fecha: 'not done' },
    usuario3: { nombre: 'Alex', done: false, fecha: 'not done' },
}

setInterval(firebaseService.initWeek(usuarios), 5 * 60 * 1000)

alvaroContainer.addEventListener('click', async () => {
    if (currentUser.email == users[0].email)
        await firebaseService.toggleDone('usuario1')
})
joanContainer.addEventListener('click', async () => {
    if (currentUser.email == users[2].email)
        await firebaseService.toggleDone('usuario2')
})
alexContainer.addEventListener('click', async () => {
    if (currentUser.email == users[3].email)
        await firebaseService.toggleDone('usuario3')
})
rubiusContainer.addEventListener('click', async () => {
    if (currentUser.email == users[1].email)
        await firebaseService.toggleDone('usuario0')
})

firebaseService.listenToUser('usuario1', (val) => {
    changeBorderColor(alvaroBorder, val)
})
firebaseService.listenToUser('usuario0', (val) => {
    changeBorderColor(rubiusBorder, val)
})
firebaseService.listenToUser('usuario2', (val) => {
    changeBorderColor(joanBorder, val)
})
firebaseService.listenToUser('usuario3', (val) => {
    changeBorderColor(alexBorder, val)
})

alvaroTask.textContent = tasks[1]
alexTask.textContent = tasks[3]
joanTask.textContent = tasks[2]
rubiuTask.textContent = tasks[0]

const today = new Date()

const day = String(today.getDate()).padStart(2, '0')
const month = String(today.getMonth() + 1).padStart(2, '0')
const year = today.getFullYear()

dayLabel.textContent = `DIA: ${day}/${month}/${year}`
const semana = cleaningModel.getWeekOfYear()

semanaLabel.textContent = `SEMANA: ${semana}`

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
