import type { Color } from "../components/Icon"

export type User = {
    id: string,
    name: string,
    username: string,
    email: string,
    image: string,
    color: Color
    task?: string
}

const emails = {
    alvaro: import.meta.env.VITE_EMAIL_ALVARO,
    rubius: import.meta.env.VITE_EMAIL_RUBIUS,
    victor: import.meta.env.VITE_EMAIL_VICTOR,
    alex: import.meta.env.VITE_EMAIL_ALEX,
}


export const baseUsers: Record<string, User> = {
    "alvaro": {
        id: "9d2fd7a7-2571-4f51-9794-4947de3a842d",
        name: "Álvaro",
        username: "alvaro",
        email: emails.alvaro,
        image: "./images/me.jpg",
        task: "",
        color: "blue"
    },
    "rubius": {
        id: "53579f58-926b-4cdf-98bc-2956c1da412c",
        name: "Rubén",
        username: "rubius",
        email: emails.rubius,
        image: "./images/rubiu.jpg",
        task: "",
        color: "yellow"
    },
    "victor": {
        id: "1a7c9359-3c3e-4e21-87ca-77890359cc1f",
        name: "Víctor",
        username: "victor",
        email: emails.victor,
        image: "./images/victor.jpg",
        task: "",
        color: "pink"
    },
    "alex": {
        id: "fa59951a-20c2-436e-bb70-cde97cdee399",
        name: "Álex",
        username: "alex",
        email: emails.alex,
        image: "./images/alex.jpg",
        task: "",
        color: "green"
    },
}

const usersByEmail: Record<string, User> = {
    [emails.alvaro]: baseUsers["alvaro"],
    [emails.rubius]: baseUsers["rubius"],
    [emails.victor]: baseUsers["victor"],
    [emails.alex]: baseUsers["alex"]
}

export function getImageByEmail(email: string) {
    return usersByEmail[email].image
}

export function getNameByEmail(email: string) {
    return usersByEmail[email].name
}

export function getUserModelByEmail(email: string) {
    return usersByEmail[email]
}
