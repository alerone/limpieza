import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "@/auth/auth";
import { useAuth } from "@/auth/AuthProvider";
import { useTitle } from "@/hooks/useTitle";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Sparkles } from "lucide-react";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const from = location.state?.from?.pathname || "/";
    useTitle("Iniciar Sesión - CleanApp");

    async function handleLogin() {
        await auth.login(() => { });
        navigate(from, { replace: true });
    }

    if (user) {
        navigate(from, { replace: true });
    }

    return (
        <div className="w-full max-w-md">
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-center gap-8 text-center border-t border-white/20">
                <div className="bg-primary/20 p-4 rounded-full ring-4 ring-primary/10">
                    <Sparkles className="w-10 h-10 text-primary" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Clean<span className="text-primary">App</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona la limpieza de tu piso de forma elegante.
                    </p>
                </div>

                <Button
                    size="lg"
                    className="w-full font-semibold text-md shadow-lg shadow-primary/20"
                    onClick={handleLogin}
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continuar con Google
                </Button>
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground opacity-50">
                &copy; {new Date().getFullYear()} CleanApp Piso.
            </p>
        </div>
    );
}

export default LoginPage;
