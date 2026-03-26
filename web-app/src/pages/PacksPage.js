import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function PacksPage() {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/");
    };

    useEffect(() => {
        fetch("http://localhost:5021/api/Packs?random=true")
            .then((response) => response.json())
            .then((data) => {
                setPacks(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching packs:", error);
                setLoading(false);
            });
    }, []);

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
                        Choose a Pack
                    </p>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
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

            <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "18px",
                        padding: "28px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                        marginBottom: "25px"
                    }}
                >
                    <h1 style={{ marginTop: 0, color: "#1e293b" }}>Available Packs</h1>
                    <p style={{ color: "#64748b" }}>
                        Pick a published pack and start playing
                    </p>
                </div>

                {loading ? (
                    <p>Loading packs...</p>
                ) : packs.length === 0 ? (
                    <p>No packs found.</p>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                            gap: "20px"
                        }}
                    >
                        {packs.map((pack) => (
                            <div
                                key={pack.id}
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "18px",
                                    padding: "22px",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
                                }}
                            >
                                <h2 style={{ marginTop: 0, color: "#1e293b" }}>{pack.name}</h2>
                                <p style={{ color: "#475569" }}>{pack.description}</p>
                                <p style={{ color: "#64748b" }}>
                                    Difficulty: <strong>{pack.difficulty}</strong>
                                </p>

                                <button
                                    onClick={() => navigate(`/play/${pack.id}`)}
                                    style={{
                                        marginTop: "10px",
                                        padding: "12px 18px",
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