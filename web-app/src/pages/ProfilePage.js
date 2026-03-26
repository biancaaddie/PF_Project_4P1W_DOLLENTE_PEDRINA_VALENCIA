import { useNavigate, Link } from "react-router-dom";

function ProfilePage() {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/");
    };

    const profileData = {
        solved: 12,
        attempts: 20,
        score: 95,
        recentPuzzles: ["Cat", "Apple", "School", "Beach"]
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
            <div
                style={{
                    backgroundColor: "#1d4ed8",
                    color: "white",
                    padding: "18px 40px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
            >
                <div>
                    <h2 style={{ margin: 0 }}>4 Pics 1 Word</h2>
                    <p style={{ margin: "5px 0 0", opacity: 0.9 }}>
                        Profile: {email}
                    </p>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    <Link
                        to="/packs"
                        style={{
                            padding: "10px 18px",
                            borderRadius: "10px",
                            backgroundColor: "white",
                            color: "#1d4ed8",
                            fontWeight: "700",
                            textDecoration: "none"
                        }}
                    >
                        Back to Packs
                    </Link>

                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            color: "white",
                            fontWeight: "700",
                            cursor: "pointer"
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "18px",
                        padding: "28px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                        marginBottom: "25px"
                    }}
                >
                    <h1 style={{ marginTop: 0, color: "#1e293b" }}>Player Profile</h1>
                    <p style={{ color: "#64748b" }}>
                        Track your progress and recent puzzles
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        marginBottom: "25px"
                    }}
                >
                    <div style={cardStyle("#dbeafe")}>
                        <h3>Solved</h3>
                        <p style={valueStyle}>{profileData.solved}</p>
                    </div>

                    <div style={cardStyle("#dcfce7")}>
                        <h3>Attempts</h3>
                        <p style={valueStyle}>{profileData.attempts}</p>
                    </div>

                    <div style={cardStyle("#fef3c7")}>
                        <h3>Score</h3>
                        <p style={valueStyle}>{profileData.score}</p>
                    </div>

                    <div style={cardStyle("#f3e8ff")}>
                        <h3>Role</h3>
                        <p style={valueStyle}>{role}</p>
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "18px",
                        padding: "24px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
                    }}
                >
                    <h2 style={{ marginTop: 0 }}>Recent Puzzles</h2>
                    <ul style={{ color: "#475569", lineHeight: "1.9" }}>
                        {profileData.recentPuzzles.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

const cardStyle = (bg) => ({
    backgroundColor: bg,
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
});

const valueStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0
};

export default ProfilePage;