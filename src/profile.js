import { handleLogout } from "./auth.js";
import { getUserName, getUserProfileImage, userService } from "./users.js";
import { auth } from "./auth.js"
import { onAuthStateChanged } from "firebase/auth";

const profileName = document.querySelector("#profile-name")
const profileImg = document.querySelector("#profile-image")
const emailLabel = document.querySelector("#email-label")
const weekCount = document.querySelector("#week-count")
const weeksList = document.querySelector("#weeks-list")
const logoutBtn = document.querySelector("#logout-button")
const loadingPage = document.querySelector("#loading-page")
const backBtn = document.querySelector("#back-button")

logoutBtn.addEventListener("click", handleLogout)
backBtn.addEventListener("click", () => {
    window.location.href = "/limpieza/dashboard.html"
})

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.history.back()
    } else {
        profileName.textContent = getUserName(user.email)
        profileImg.src = getUserProfileImage(user.email)
        emailLabel.textContent = user.email

        userService.listenToUserHistory(user.email, (weeks) => {
            if (!loadingPage.classList["hidden"]) {
                loadingPage.classList.add("hidden")
            }
            weekCount.textContent = weeks.length
            weeksList.innerHTML = ""
            weeks.forEach((week) => {
                const li = document.createElement("li");
                li.textContent = `Semana: ${week}`
                weeksList.appendChild(li)
            })
        })
    }
})



