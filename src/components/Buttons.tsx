type ButtonProps = {
    label: string,
    className?: string,
    onButtonClick: () => void,
}

export function LoginButton({ onButtonClick }: { onButtonClick: () => void }) {
    return (
        <button
            id="loginBtn"
            className="inline-flex items-center gap-2 px-3 py-1 text-md font-semibold bg-white text-gray-800 border border-gray-300 rounded-md shadow hover:bg-gray-100"
            onClick={onButtonClick}
        >
            <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
            >
                <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3C33.4 33.2 29.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 6 .9 8.2 2.7l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c11 0 20.3-8 20.3-21 0-1.2-.1-2.1-.3-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.6l6.6 4.8C14.5 16.2 18.9 14 24 14c3.1 0 6 .9 8.2 2.7l6-6C34.5 5.1 29.5 3 24 3 16.1 3 9.2 7.8 6.3 14.6z" />
                <path fill="#4CAF50" d="M24 45c5.1 0 10-1.7 13.7-4.7l-6.3-5.2C29.6 36.4 26.9 37 24 37c-5 0-9.2-3-11-7.3l-6.6 5.1C9.1 41.8 16.1 45 24 45z" />
                <path fill="#1976D2" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.2 3.3-4.4 6.4-11.3 6.4-5 0-9.2-3-11-7.3l-6.6 5.1C9.1 41.8 16.1 45 24 45c11 0 20.3-8 20.3-21 0-1.2-.1-2.1-.3-3.5z" />
            </svg>
            Iniciar sesión con Google
        </button>
    )
}

export function PrimaryButton({ label, className, onButtonClick }: ButtonProps) {
    return (
        <button
            className={`bg-orange-300 font-bold text-md text-gray-800 ${className} px-3 py-1 hover:scale-95 hover:bg-orange-400 hover:text-white transition-all duration-300`}
            onClick={onButtonClick}
        >
            {label}
        </button>
    )
}
