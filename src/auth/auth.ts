import { signOut, getAuth, GoogleAuthProvider, signInWithPopup, type User, signInWithRedirect, getRedirectResult } from 'firebase/auth'
import { app } from '../firebase/firebase'
import { isIOSSafari } from '../utils/isIOS'


export const authInstance = getAuth(app)
const provider = new GoogleAuthProvider()
provider.setCustomParameters({
    prompt: "select_account"
})

export const auth = {
    async login(callback: (user: User) => void) {
        if (true) {
            try {
                await signInWithRedirect(authInstance, provider)
            } catch (error) {
                console.error("Error en signInWithRedirect:", error)
            }
        } else {
            console.log("hola")
            const result = await signInWithPopup(authInstance, provider)
            callback(result.user)
        }
    },
    async handleRedirectResult() {
        try {
            const result = await getRedirectResult(authInstance);
            console.log("user", result)
            if (result) {
                const user = result.user;
                console.log("Usuario:", user);
            }
        } catch (error) {
            console.error("Error en el login con redirect:", error);
        }
    },
    async logout(callback?: () => void) {
        await signOut(authInstance)
        if (callback)
            callback()
    }
}



