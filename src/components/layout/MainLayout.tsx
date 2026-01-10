import { useEffect, type ReactNode } from "react";
import { BackgroundWrapper } from "./BackgroundWrapper";
import { Navbar } from "./Navbar";
import { useWeekTracker } from "@/hooks/useWeekTracker";
import { initializeCurrentWeekIfNeeded } from "@/services/cleaningService";

export function MainLayout({ children }: { children: ReactNode }) {
    const currentRealWeek = useWeekTracker();
    useEffect(() => {
        initializeCurrentWeekIfNeeded().catch(console.error);
    }, [currentRealWeek]);

    return (
        <BackgroundWrapper>
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6 md:py-10 animate-in fade-in duration-500">
                {children}
            </main>
        </BackgroundWrapper>
    );
}

// Layout para Login (Sin Navbar)
export function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <BackgroundWrapper>
            <main className="flex-1 flex items-center justify-center p-4 animate-in zoom-in-95 duration-500">
                {children}
            </main>
        </BackgroundWrapper>
    );
}
