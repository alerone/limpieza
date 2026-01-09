import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { authInstance } from "./auth";
import {
    getRedirectResult,
    onAuthStateChanged,
    type User,
} from "firebase/auth";
import { initializeCurrentWeekIfNeeded } from "@/services/cleaningService";

const AuthContext = createContext(null as any);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const handleRedirectAndAuthState = async () => {
            try {
                // Handle redirect result first
                const result = await getRedirectResult(authInstance);
                if (result) {
                    console.log("Redirect result user:", result.user);
                    setUser(result.user);
                }
            } catch (error) {
                console.error("Error handling redirect:", error);
            }

            // Then set up auth state listener
            unsubscribe = onAuthStateChanged(authInstance, async (user) => {
                await initializeCurrentWeekIfNeeded();
                setUser(user);
                setInitializing(false);
            });
        };

        handleRedirectAndAuthState();

        // Cleanup function
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, initializing }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be inside AuthProvider");
    return context;
}
