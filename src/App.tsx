import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/Login'
import { ProfilePage } from './pages/Profile'
import { useEffect } from 'react'
import { auth } from './auth/auth'

function App() {
    useEffect(() => {
        const redirectResult = async () => auth.handleRedirectResult()
        redirectResult()
    }, [])
    return (
        <BrowserRouter basename="/limpieza">
            <AuthProvider>
                <Routes>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
