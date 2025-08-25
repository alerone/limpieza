import { useEffect, useState } from "react"
import { db } from "../firebase/firebase"
import { off, onValue, ref } from "firebase/database"

export const useFirebaseValue = (path: string) => {
    const [value, setValue] = useState<any | null>(null)

    useEffect(() => {
        if (path === "") return
        const dbRef = ref(db, path)

        const unsubscribe = onValue(dbRef, (snapshot) => {
            setValue(snapshot.val())
        })

        return () => off(dbRef, "value", unsubscribe)
    }, [path])

    return value
}
