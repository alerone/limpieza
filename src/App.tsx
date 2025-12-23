import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import { ProfilePage } from "./pages/Profile";
import { useTitle } from "./hooks/useTitle";
import { MainLayout, AuthLayout } from "./components/layout/MainLayout";
import RankingPage from "./pages/Ranking";
import OptionalTasksPage from "./pages/OptionalTasks";

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
                    <Route
                        path="ranking"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <RankingPage />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="tasks"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <OptionalTasksPage />
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
