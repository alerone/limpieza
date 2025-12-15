import { useGetUsersInfo } from "../hooks/useGetUsersInfo";
import { WeekDisplay } from "../components/WeekDisplay";
import { getImageByEmail, type User } from "../types/User";
import { CardGrid } from "../components/CardGrid";
import { toggleDone } from "../firebase/weekHistory";
import { Icon } from "../components/Icon";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";

function Dashboard() {
    const users = useGetUsersInfo();
    const navigate = useNavigate();
    const { user } = useAuth();

    useTitle("Home - Tareas de Limpieza");

    const usersList: User[] = Object.values(users);
    return (
        <div
            className=" p-4 bg-gradient-to-br from-indigo-600 via-purple-800 to-pink-900 flex flex-col w-screen xl:h-screen 
            h-auto items-center gap-10 xl:gap-24"
        >
            <Icon
                image={getImageByEmail(user.email)}
                onClick={() => navigate("profile")}
                size="medium"
                className="absolute top-1 xl:top-4  right-1 xl:right-8"
            />
            <WeekDisplay className="mt-10" />
            <CardGrid
                users={usersList}
                onToggleCompleted={(user) => {
                    toggleDone(user.username, user.email, user.task ?? "no task");
                }}
                currentEmail={user.email}
            />
        </div>
    );
}

export default Dashboard;
