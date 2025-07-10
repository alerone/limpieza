import { signOut, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { app } from "./firebase.js"

export const auth = getAuth(app)
const provider = new GoogleAuthProvider()
provider.setCustomParameters({
    prompt: "select_account"
})

export async function handleLogin() {
    try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        localStorage.setItem("user", JSON.stringify(user))
        window.location.href = "./dashboard.html"
    } catch (error) {
        console.error("Error logging in", error)
    }
}

export async function handleLogout() {
    await signOut(auth)
    localStorage.removeItem("user")
    window.location.href = "/index.html"
}

export function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "/index.html"
        } else {
            return user
        }
    })
}
