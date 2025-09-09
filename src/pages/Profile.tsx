import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import { PrimaryButton } from "../components/Buttons"
import { Icon } from "../components/Icon"
import { getUserModelByEmail, type User } from "../types/User"
import { UserHistory } from "../components/UserHistory"
import { useHistory } from "../hooks/useHistory"
import { auth } from "../auth/auth"
import { useTitle } from "../hooks/useTitle"
export function ProfilePage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const userInstance: User = getUserModelByEmail(user.email)
    const history = useHistory(user.email)

    useTitle("Perfil - Tareas de Limpieza")

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <div className='bg-gradient-to-br from-emerald-700 via-cyan-800 to-green-800 flex flex-col w-screen h-screen'>
            <div className="flex flex-row justify-end p-2 bg-gradient-to-r from-emerald-500 to-emerald-700 mb-10">
                <PrimaryButton label="Atrás" onButtonClick={handleBack} />
            </div>
            <main className="flex flex-col px-8 gap-10">
                <div className="flex items-center gap-2 xl:gap-10">
                    <Icon size="big" image={userInstance.image} color={userInstance.color} />
                    <div className="flex flex-col justify-center">
                        <h2 className="font-semibold text-lg xl:text-2xl">{userInstance.name}</h2>
                        <h2 className="font-semibold text-lg xl:text-2xl">{user.email}</h2>
                    </div>
                </div>
                {history &&
                    <UserHistory history={history} />
                }
            </main>
            <div className="absolute flex bottom-8 w-full items-center justify-center">
                <button
                    className="font-bold bg-rose-500 text-white rounded-lg px-2 py-1 text-md 
                    hover:cursor-pointer hover:scale-95 transition-all duration-200 xl:text-xl"
                    onClick={() => auth.logout()}
                >Cerrar Sesión</button>
            </div>
        </div>
    )
}
