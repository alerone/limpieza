import { isAdmin } from "@/auth/isAdmin";
import type { User } from "@/types/User";
import { Card } from "./Card";

type CardGridProps = {
    users: User[];
    currentEmail: string;
    onToggleCompleted: (user: User) => void;
};
export function CardGrid({
    users,
    currentEmail,
    onToggleCompleted,
}: CardGridProps) {
    return (
        <div className="w-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-8 h-auto xl:min-h-[300px]">
            {users.length > 0 &&
                users.map((user) => (
                    <Card
                        key={user.id}
                        onClickTask={() => onToggleCompleted(user)}
                        user={user}
                        hasPermission={currentEmail === user.email || isAdmin(currentEmail)}
                    />
                ))}
        </div>
    );
}
