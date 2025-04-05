import { UserModel, CleaningModel } from './models.js'
import { initializeApp } from 'firebase/app'

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

const app = initializeApp(firebaseConfig)

const users = [
    new UserModel('Álvaro'),
    new UserModel('Rubén'),
    new UserModel('Joan'),
    new UserModel('Álex'),
]
const cleaningModel = new CleaningModel(users)
console.log(cleaningModel.getUsers(), cleaningModel.getTaskOrder())

const alvaroTask = document.querySelector('#alvaroTask')
const alexTask = document.querySelector('#alexTask')
const joanTask = document.querySelector('#joanTask')
const rubiuTask = document.querySelector('#rubiuTask')

const dayLabel = document.querySelector('#diaLabel')
const semanaLabel = document.querySelector('#semanaLabel')

const tasks = cleaningModel.getTaskOrder()

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
