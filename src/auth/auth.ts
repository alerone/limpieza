import { signOut, getAuth, GoogleAuthProvider, signInWithPopup, type User } from 'firebase/auth'
import { app } from '../firebase/firebase'


export const authInstance = getAuth(app)
const provider = new GoogleAuthProvider()
provider.setCustomParameters({
    prompt: "select_account"
})

export const auth = {
    async login(callback: (user: User) => void) {
        const result = await signInWithPopup(authInstance, provider)
        callback(result.user)
    },
    async logout(callback?: () => void) {
        await signOut(authInstance)
        if (callback)
            callback()
    }
}



