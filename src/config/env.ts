const requiredEnv = (key: string, value: string | undefined): string => {
    if (!value) throw new Error(`Missing env variable: ${key}`);
    return value;
};

export const ENV = {
    firebase: {
        apiKey: requiredEnv(
            "VITE_FIREBASE_API_KEY",
            import.meta.env.VITE_FIREBASE_API_KEY,
        ),
        authDomain: requiredEnv(
            "VITE_FIREBASE_AUTH_DOMAIN",
            import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        ),
        databaseURL: requiredEnv(
            "VITE_FIREBASE_DB_URL",
            import.meta.env.VITE_FIREBASE_DB_URL,
        ),
        projectId: requiredEnv(
            "VITE_FIREBASE_PROJECT_ID",
            import.meta.env.VITE_FIREBASE_PROJECT_ID,
        ),
        storageBucket: requiredEnv(
            "VITE_FIREBASE_STORAGE_BUCKET",
            import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        ),
        messagingSenderId: requiredEnv(
            "VITE_FIREBASE_MESSAGING_SENDER_ID",
            import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        ),
        appId: requiredEnv(
            "VITE_FIREBASE_APP_ID",
            import.meta.env.VITE_FIREBASE_APP_ID,
        ),
    },
    adminEmail: import.meta.env.VITE_ADMIN_EMAIL || "",
    users: {
        alvaro: import.meta.env.VITE_EMAIL_ALVARO || "",
        rubius: import.meta.env.VITE_EMAIL_RUBIUS || "",
        victor: import.meta.env.VITE_EMAIL_VICTOR || "",
        alex: import.meta.env.VITE_EMAIL_ALEX || "",
    },
} as const;
