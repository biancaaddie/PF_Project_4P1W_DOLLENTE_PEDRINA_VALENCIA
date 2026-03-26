import { useNavigate } from "react-router-dom";

function AdminPage() {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/");
    };

    return (
        <div style={{ padding: "50px" }}>
            <h2>Admin Page</h2>
            <p>Welcome Admin: {email}</p>
            <p>Role: {role}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default AdminPage;