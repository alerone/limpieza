import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { auth } from "@/auth/auth";
import { useTitle } from "@/hooks/useTitle";
import { useHistory } from "@/hooks/useHistory";
import { Avatar } from "@/components/ui/Avatar";
import { PrimaryButton } from "@/components/Buttons";
import { UserHistory } from "@/components/UserHistory";
import { CLEANERS } from "@/config/cleaners";

export function ProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    useTitle("Perfil - Tareas de Limpieza");

    // Obtener datos del usuario desde la nueva config centralizada
    const userProfile = Object.values(CLEANERS).find(
        (c) => c.email === user?.email,
    );

    // El hook useHistory aún funciona con el email, lo mantenemos por ahora
    const history = useHistory(user?.email || "");

    const handleBack = () => navigate(-1);

    if (!userProfile) {
        return (
            <div className="text-white text-center mt-20">
                Usuario no encontrado en la configuración.
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-emerald-700 via-cyan-800 to-green-800 flex flex-col">
            {/* Header / Nav */}
            <div className="flex justify-end p-4 bg-black/20 backdrop-blur-sm">
                <PrimaryButton
                    label="Atrás"
                    onButtonClick={handleBack}
                    className="shadow-lg"
                />
            </div>

            <main className="flex-1 flex flex-col items-center px-4 gap-8 py-10 max-w-4xl mx-auto w-full">
                {/* Info Usuario */}
                <div className="flex flex-col md:flex-row items-center gap-6 bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/20 w-full justify-center">
                    <Avatar
                        size="xl"
                        src={userProfile.avatarUrl}
                        alt={userProfile.name}
                        colorTheme={userProfile.themeColor}
                    />
                    <div className="text-center md:text-left text-white space-y-2">
                        <h2 className="font-bold text-3xl md:text-4xl">
                            {userProfile.name}
                        </h2>
                        <p className="font-light text-lg opacity-90">{userProfile.email}</p>
                    </div>
                </div>

                {/* Historial */}
                <div className="w-full">
                    {history && <UserHistory history={history} />}
                </div>

                {/* Logout */}
                <div className="mt-auto pb-8">
                    <button
                        className="font-bold bg-rose-600 text-white rounded-full px-8 py-3 text-lg 
                        hover:bg-rose-700 hover:scale-105 hover:shadow-lg transition-all duration-200"
                        onClick={() => auth.logout()}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </main>
        </div>
    );
}
