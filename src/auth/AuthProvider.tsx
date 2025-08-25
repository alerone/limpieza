import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authInstance } from "./auth";
import { onAuthStateChanged, type User } from "firebase/auth";

const AuthContext = createContext(null as any)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [initializing, setInitializing] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
            setUser(firebaseUser)
            setInitializing(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, initializing }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be inside AuthProvider")
    return context
}

