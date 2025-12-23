import type { CleanerProfile } from "../types/domain";
import { ENV } from "./env";

export const CLEANERS: Record<string, CleanerProfile> = {
    alvaro: {
        id: "9d2fd7a7-2571-4f51-9794-4947de3a842d",
        username: "alvaro",
        name: "Álvaro",
        email: ENV.users.alvaro,
        avatarUrl: "/images/me.jpg",
        themeColor: "blue",
    },
    rubius: {
        id: "53579f58-926b-4cdf-98bc-2956c1da412c",
        username: "rubius",
        name: "Rubén",
        email: ENV.users.rubius,
        avatarUrl: "/images/rubiu.jpg",
        themeColor: "yellow",
    },
    victor: {
        id: "1a7c9359-3c3e-4e21-87ca-77890359cc1f",
        username: "victor",
        name: "Víctor",
        email: ENV.users.victor,
        avatarUrl: "/images/victor.jpg",
        themeColor: "pink",
    },
    alex: {
        id: "fa59951a-20c2-436e-bb70-cde97cdee399",
        username: "alex",
        name: "Álex",
        email: ENV.users.alex,
        avatarUrl: "/images/alex.jpg",
        themeColor: "green",
    },
};

export const CLEANER_LIST = Object.values(CLEANERS);
