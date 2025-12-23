import { useLocation, useNavigate } from "react-router-dom";
import { LoginButton } from "@/components/Buttons";
import { auth } from "@/auth/auth";
import { useAuth } from "@/auth/AuthProvider";
import { useTitle } from "@/hooks/useTitle";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    console.log("user-useAuth", user);

    const from = location.state?.from?.pathname || "/";

    useTitle("Iniciar Sesión - Tareas de Limpieza");

    async function handleLogin() {
        await auth.login(() => {
            console.log(from);
        });
        navigate(from, { replace: true });
    }

    if (user) {
        navigate(from, { replace: true });
    }

    return (
        <div className="justify-center p-6 bg-gradient-to-br from-indigo-900 via-gray-800 to-indigo-950 flex flex-col w-screen h-screen items-center gap-10 xl:gap-24">
            <h1 className="font-semibold text-center">Limpieza del Piso</h1>
            <LoginButton onButtonClick={handleLogin} />
        </div>
    );
}

export default LoginPage;
