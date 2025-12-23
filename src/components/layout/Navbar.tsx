import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, LogOut, User, LayoutDashboard, Sparkles } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { auth } from "@/auth/auth";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CLEANERS } from "@/config/cleaners";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Obtener datos del perfil actual
  const userProfile = Object.values(CLEANERS).find(
    (c) => c.email === user?.email,
  );

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await auth.logout();
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
        {/* LOGO / TÍTULO */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Clean<span className="text-primary">App</span>
          </span>
        </div>

        {/* MENÚ DERECHA */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[300px] border-l border-white/10 bg-zinc-950/95 backdrop-blur-xl text-white"
          >
            <SheetHeader>
              <SheetTitle className="text-left text-white flex items-center gap-3 pb-6 border-b border-white/10">
                {userProfile && (
                  <Avatar
                    src={userProfile.avatarUrl}
                    alt="Profile"
                    size="sm"
                    colorTheme={userProfile.themeColor}
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold">
                    {userProfile?.name || "Usuario"}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Menú Principal
                  </span>
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-2 mt-6">
              <NavButton
                icon={<LayoutDashboard size={20} />}
                label="Panel Principal"
                active={isActive("/")}
                onClick={() => handleNavigation("/")}
              />
              <NavButton
                icon={<User size={20} />}
                label="Mi Perfil"
                active={isActive("/profile")}
                onClick={() => handleNavigation("/profile")}
              />
            </div>

            <div className="mt-auto pt-6 border-t border-white/10 absolute bottom-6 w-[calc(100%-3rem)]">
              <Button
                variant="destructive"
                className="w-full gap-2 font-semibold"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Cerrar Sesión
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

// Botón auxiliar para el menú
function NavButton({ icon, label, onClick, active }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
            ${
              active
                ? "bg-primary/20 text-primary border border-primary/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
    >
      {icon}
      {label}
    </button>
  );
}
