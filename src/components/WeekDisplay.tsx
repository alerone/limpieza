import { useWeekTracker } from "@/hooks/useWeekTracker";

export function WeekDisplay({ className }: { className?: string }) {
    const week = useWeekTracker();

    const weekBounds = week.split("-");

    const monday = weekBounds[0];
    const sunday = weekBounds[1];

    return (
        <div
            className={`max-w-md mx-auto p-3 px-6 rounded-2xl shadow-lg
                    bg-gradient-to-r from-gray-300 via-gray-200 to-gray-400
                    border border-gray-400
                    text-gray-800
                    hover:shadow-xl transition-shadow duration-300 ${className}`}
        >
            <p className="font-bold text-2xl text-center">
                Semana: <br />
                {monday} <br />
                {sunday} <br />
            </p>
        </div>
    );
}
