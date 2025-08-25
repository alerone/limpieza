import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "./loader/Loader";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, initializing } = useAuth()
    const location = useLocation()

    if (initializing) {
        return (
            <div className="flex flex-col gap-4 items-center justify-center w-screen">
                <h1 className="text-center font-bold text-white">Loading...</h1>
                <Loader />
            </div>
        )
    }

    if (!user) {
        return <Navigate to={"/login"} state={{ from: location }} replace />
    }

    return children
}

