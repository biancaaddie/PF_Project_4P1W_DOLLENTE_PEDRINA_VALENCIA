import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PacksPage from "./pages/PacksPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import PlayPage from "./pages/PlayPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/packs"
                    element={
                        <ProtectedRoute>
                            <PacksPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/play/:packId"
                    element={
                        <ProtectedRoute>
                            <PlayPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;