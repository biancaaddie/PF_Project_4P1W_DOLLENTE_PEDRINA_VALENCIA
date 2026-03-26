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

    const cardStyle = {
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "22px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
        transition: "0.2s",
        cursor: "pointer"
    };

    const hoverIn = (e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)";
    };

    const hoverOut = (e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.05)";
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f1f5f9"
            }}
        >
            <div
                style={{
                    backgroundColor: "#0f172a",
                    color: "white",
                    padding: "18px 40px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
            >
                <h2 style={{ margin: 0 }}>4 Pics 1 Word Admin</h2>

                <button
                    onClick={handleLogout}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                    }}
                    style={{
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        color: "white",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "0.2s"
                    }}
                >
                    Logout
                </button>
            </div>

            <div
                style={{
                    maxWidth: "1000px",
                    margin: "40px auto",
                    padding: "0 20px"
                }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "18px",
                        padding: "30px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                        marginBottom: "25px"
                    }}
                >
                    <h1 style={{ marginTop: 0, color: "#1e293b" }}>Admin Dashboard</h1>
                    <p style={{ color: "#64748b" }}>
                        Manage images, puzzles, packs, and player content.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px"
                    }}
                >
                    <div style={cardStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                        <h3 style={{ marginTop: 0 }}>Admin Email</h3>
                        <p style={{ color: "#475569" }}>{email}</p>
                    </div>

                    <div style={cardStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                        <h3 style={{ marginTop: 0 }}>Role</h3>
                        <p style={{ color: "#475569" }}>{role}</p>
                    </div>

                    <div style={cardStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                        <h3 style={{ marginTop: 0 }}>System Access</h3>
                        <p style={{ color: "#16a34a", fontWeight: "600" }}>Admin granted</p>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: "25px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "20px"
                    }}
                >
                    <div
                        onMouseEnter={hoverIn}
                        onMouseLeave={hoverOut}
                        style={{
                            ...cardStyle,
                            backgroundColor: "#dbeafe"
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>Images</h3>
                        <p>Upload and manage puzzle images.</p>
                    </div>

                    <div
                        onMouseEnter={hoverIn}
                        onMouseLeave={hoverOut}
                        style={{
                            ...cardStyle,
                            backgroundColor: "#dcfce7"
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>Puzzles</h3>
                        <p>Create and organize puzzle content.</p>
                    </div>

                    <div
                        onMouseEnter={hoverIn}
                        onMouseLeave={hoverOut}
                        style={{
                            ...cardStyle,
                            backgroundColor: "#fef3c7"
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>Packs</h3>
                        <p>Manage game packs and publishing status.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;