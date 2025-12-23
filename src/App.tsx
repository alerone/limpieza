import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import { ProfilePage } from "./pages/Profile";
import { useTitle } from "./hooks/useTitle";
import { MainLayout, AuthLayout } from "./components/layout/MainLayout";

function App() {
    useTitle("CleanApp - Tareas");
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path="login"
                        element={
                            <AuthLayout>
                                <LoginPage />
                            </AuthLayout>
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Dashboard />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="profile"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <ProfilePage />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
