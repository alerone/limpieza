import { auth, handleLogin } from './auth.js'
import { onAuthStateChanged } from 'firebase/auth'

const loginButton = document.querySelector('#loginBtn')

loginButton.addEventListener("click", handleLogin)
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "dashboard.html"
    }
})

