import { useEffect, useState } from "react";
import { getCurrentWeekUserPath } from "../firebase/weekHistory";
import { useFirebaseValue } from "../hooks/useFirebaseValue";
import type { User } from "../types/User";
import { Icon } from "./Icon";
import { addTaskNotDone, removeTaskNotDone } from "../firebase/usersHistory";

type CardProps = {
    user: User;
    hasPermission: boolean;
    onClickTask: () => void;
};

export function Card({ user, hasPermission, onClickTask }: CardProps) {
    const [userPath, setUserPath] = useState<string | null>(null);
    const [timeout, setTimeoutValue] = useState(200);

    useEffect(() => {
        const fetchUserPath = async () => {
            const path = getCurrentWeekUserPath(user.username);
            setUserPath(path);
        };
        fetchUserPath();
    }, [user.name]);

    const userVal = useFirebaseValue(userPath ?? "");
    const isDone = userVal?.done ?? false;

    const timeDone = userVal?.fecha ?? "";

    return (
        <div
            className={`flex flex-col justify-between ${hasPermission ? "hover:cursor-pointer hover:scale-105 hover:shadow-xl" : ""} transition-all duration-300 bg-slate-50 shadow-lg rounded-xl overflow-hidden p-4 xl:p-3`}
            onClick={() => {
                if (hasPermission) onClickTask();
            }}
        >
            <div className="flex flex-col gap-1 items-center p-2 rounded-lg ">
                <Icon image={user.image} color={user.color} size="small" />
                <h2 className="text-2xl xl:text-xl font-bold text-gray-800">
                    {user.name}
                </h2>
                <div className="bg-gray-200 rounded-full h-[3px] w-full"></div>
            </div>
            <div className="flex mt-2 xl:mt-0 flex-col gap-2">
                <h3 className="bg-gradient-to-r from-orange-300 to-orange-400  rounded-lg text-2xl font-bold xl:text-xl text-center shadow-md text-gray-800 lato-font">
                    {user.task}
                </h3>
                <div className="flex flex-row justify-end items-center gap-3">
                    {isDone && (
                        <span className="text-emerald-500 font-semibold text-xs">
                            {timeDone}
                        </span>
                    )}
                    <span
                        className={`inline-flex items-center justify-center 
                            rounded-full text-xs font-bold shadow-md
                            px-3 py-1 
                            ${isDone ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}
                    >
                        {isDone ? "Hecho" : "Pendiente"}
                    </span>
                </div>
            </div>
        </div>
    );
}
