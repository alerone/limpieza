import { handleLogin } from './auth.js'

const loginButton = document.querySelector('#loginButton')

if (loginButton) {
    loginButton.addEventListener("click", handleLogin)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = "dashboard.html"
        }
    })
}

