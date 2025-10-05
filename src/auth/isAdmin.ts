export function isAdmin(email: string) {
    return email === import.meta.env.VITE_ADMIN_EMAIL
}
