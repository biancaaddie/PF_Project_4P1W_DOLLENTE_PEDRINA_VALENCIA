import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function PacksPage() {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/");
    };

    useEffect(() => {
        fetch("http://localhost:5021/api/Packs?random=true")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch packs");
                }
                return res.json();
            })
            .then((data) => {
                setPacks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Could not load packs from the server.");
                setLoading(false);
            });
    }, []);

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
                        Welcome, {email}
                    </p>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <Link
                        to="/profile"
                        style={{
                            padding: "10px 18px",
                            borderRadius: "10px",
                            backgroundColor: "white",
                            color: "#1d4ed8",
                            fontWeight: "700",
                            textDecoration: "none"
                        }}
                    >
                        Profile
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

            <div
                style={{
                    maxWidth: "1100px",
                    margin: "40px auto",
                    padding: "0 20px"
                }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "18px",
                        padding: "28px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                        marginBottom: "25px"
                    }}
                >
                    <h1 style={{ marginTop: 0, color: "#1e293b" }}>Choose a Pack</h1>
                    <p style={{ color: "#64748b" }}>
                        Role: {role} • Select a randomized published pack and start playing
                    </p>
                </div>

                {loading && (
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "24px",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
                        }}
                    >
                        Loading packs...
                    </div>
                )}

                {error && (
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "24px",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                            color: "#dc2626"
                        }}
                    >
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "20px"
                        }}
                    >
                        {packs.map((pack) => (
                            <div
                                key={pack.id}
                                style={cardStyle}
                                onMouseEnter={hoverIn}
                                onMouseLeave={hoverOut}
                            >
                                <h3 style={{ marginTop: 0, color: "#1e293b" }}>{pack.name}</h3>
                                <p style={{ color: "#64748b", minHeight: "45px" }}>
                                    {pack.description}
                                </p>
                                <p style={{ color: "#475569", marginBottom: "14px" }}>
                                    Difficulty: {pack.difficulty}
                                </p>

                                <button
                                    onClick={() => navigate(`/play/${pack.id}`)}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "none",
                                        borderRadius: "10px",
                                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                        color: "white",
                                        fontWeight: "700",
                                        cursor: "pointer"
                                    }}
                                >
                                    Play Pack
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PacksPage;