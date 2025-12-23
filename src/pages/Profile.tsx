import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { auth } from "@/auth/auth";
import { useTitle } from "@/hooks/useTitle";
import { useHistory } from "@/hooks/useHistory";
import { Avatar } from "@/components/ui/Avatar";
import { UserHistory } from "@/components/UserHistory";
import { CLEANERS } from "@/config/cleaners";
import { ArrowLeft, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button"; // Usamos el botón de shadcn si lo tienes, o un HTML button simple

export function ProfilePage() {
  useTitle("Mi Perfil - CleanApp");
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Obtener datos centralizados
  const userProfile = Object.values(CLEANERS).find(
    (c) => c.email === user?.email,
  );

  // 2. Hook de historial
  const { history, loading: historyLoading } = useHistory(user?.email);

  const handleBack = () => navigate(-1);
  const handleLogout = async () => {
    await auth.logout();
    navigate("/login");
  };

  if (!userProfile) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Usuario no configurado en el sistema.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white flex flex-col animate-in fade-in duration-500">
      {/* Navbar Simple */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 md:px-8 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Volver</span>
        </button>
        <span className="text-sm font-bold text-gray-500 tracking-widest uppercase">
          Perfil
        </span>
      </header>

      <main className="flex-1 container max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Tarjeta de Identidad */}
        <section className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 p-6 md:p-10 text-center shadow-2xl">
          {/* Fondo decorativo sutil */}
          <div
            className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-${userProfile.themeColor}-900/20 to-transparent opacity-50`}
          />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="group relative">
              {/* Glow effect detrás del avatar */}
              <div
                className={`absolute -inset-1 rounded-full blur-xl opacity-20 bg-${userProfile.themeColor}-500 group-hover:opacity-40 transition-opacity duration-500`}
              />

              <Avatar
                size="xl"
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                colorTheme={userProfile.themeColor}
                className="relative shadow-2xl"
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                {userProfile.name}
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Mail size={14} />
                <span>{userProfile.email}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Historial */}
        <section>
          {historyLoading ? (
            <div className="text-center text-gray-500 py-10 animate-pulse">
              Cargando historial...
            </div>
          ) : (
            <UserHistory history={history} />
          )}
        </section>

        {/* Zona de Peligro / Logout */}
        <div className="mt-auto pt-8 flex justify-center">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="gap-2 font-semibold shadow-lg shadow-red-900/20"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </Button>
        </div>
      </main>
    </div>
  );
}
