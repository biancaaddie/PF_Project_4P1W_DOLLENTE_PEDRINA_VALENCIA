import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function PlayPage() {
    const { packId } = useParams();
    const navigate = useNavigate();
    const [guess, setGuess] = useState("");
    const [feedback, setFeedback] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/");
    };

    const handleSubmit = () => {
        const normalized = guess.trim().toLowerCase();

        if (normalized === "cat") {
            setFeedback("? Correct! Score +10");
        } else {
            setFeedback("? Incorrect. Try again.");
        }
    };

    const handleNext = () => {
        setGuess("");
        setFeedback("");
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
                        Playing Pack #{packId}
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
                    <h1 style={{ marginTop: 0, color: "#1e293b" }}>Puzzle Challenge</h1>
                    <p style={{ color: "#64748b" }}>
                        Guess the word based on the 4 pictures below
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "18px",
                        marginBottom: "25px"
                    }}
                >
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            style={{
                                backgroundColor: "white",
                                borderRadius: "16px",
                                height: "180px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                                fontSize: "22px",
                                fontWeight: "700",
                                color: "#64748b"
                            }}
                        >
                            Image {item}
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "18px",
                        padding: "24px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
                    }}
                >
                    <h2 style={{ marginTop: 0 }}>Your Answer</h2>

                    <input
                        type="text"
                        placeholder="Type your guess"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #cbd5e1",
                            boxSizing: "border-box",
                            marginBottom: "16px"
                        }}
                    />

                    <div style={{ display: "flex", gap: "12px" }}>
                        <button onClick={handleSubmit} style={primaryButton}>
                            Submit Guess
                        </button>

                        <button onClick={handleNext} style={secondaryButton}>
                            Next Puzzle
                        </button>
                    </div>

                    {feedback && (
                        <p
                            style={{
                                marginTop: "18px",
                                fontWeight: "700",
                                color: feedback.includes("Correct") ? "#16a34a" : "#dc2626"
                            }}
                        >
                            {feedback}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

const primaryButton = {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer"
};

const secondaryButton = {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#e2e8f0",
    color: "#1e293b",
    fontWeight: "700",
    cursor: "pointer"
};

export default PlayPage;