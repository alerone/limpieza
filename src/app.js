import { UserModel, CleaningModel } from './models.js'
import { FirebaseService } from './firebase.js'

const users = [
    new UserModel('Álvaro'),
    new UserModel('Rubén'),
    new UserModel('Joan'),
    new UserModel('Álex'),
]
const cleaningModel = new CleaningModel(users)
const firebaseService = new FirebaseService()

console.log(cleaningModel.getUsers(), cleaningModel.getTaskOrder())

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

const tasks = cleaningModel.getTaskOrder()

const usuarios = {
    usuario0: { nombre: 'Rubiu', done: false },
    usuario1: { nombre: 'Álvaro', done: false },
    usuario2: { nombre: 'Joan', done: false },
    usuario3: { nombre: 'Alex', done: false },
}
firebaseService.initWeek(usuarios)

alvaroContainer.addEventListener('click', async () => {
    await firebaseService.marcarUltimoUsuarioComoHecho('usuario1')
})
joanContainer.addEventListener('click', async () => {
    await firebaseService.marcarUltimoUsuarioComoHecho('usuario2')
})
alexContainer.addEventListener('click', async () => {
    await firebaseService.marcarUltimoUsuarioComoHecho('usuario3')
})
rubiusContainer.addEventListener('click', async () => {
    await firebaseService.marcarUltimoUsuarioComoHecho('usuario0')
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
