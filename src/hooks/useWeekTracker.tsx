import { useEffect, useState } from "react";
import { getWeekBounds } from "@/utils/date";

export function useWeekTracker() {
    const [week, setWeek] = useState(getWeekBounds());

    useEffect(() => {
        const interval = setInterval(
            () => {
                const currentWeek = getWeekBounds();
                if (currentWeek != week) {
                    setWeek(currentWeek);
                }
            },
            5 * 60 * 1000,
        );
        return () => clearInterval(interval);
    }, [week]);

    return week;
}
