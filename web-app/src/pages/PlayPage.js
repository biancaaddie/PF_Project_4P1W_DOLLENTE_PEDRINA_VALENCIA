import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function PlayPage() {
    const { packId } = useParams();
    const navigate = useNavigate();

    const [puzzle, setPuzzle] = useState(null);
    const [guess, setGuess] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [puzzleNumber, setPuzzleNumber] = useState(1);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/");
    };

    const loadNextPuzzle = () => {
        setLoading(true);
        setFeedback("");
        setGuess("");

        fetch(`http://localhost:5021/api/Puzzles/next?packId=${packId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("No more puzzles");
                }
                return response.json();
            })
            .then((data) => {
                setPuzzle(data);
                setFinished(false);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading next puzzle:", error);
                setPuzzle(null);
                setFinished(true);
                setLoading(false);
            });
    };

    useEffect(() => {
        setScore(0);
        setPuzzleNumber(1);
        loadNextPuzzle();
    }, [packId]);

    const handleSubmit = () => {
        if (!puzzle) return;

        fetch("http://localhost:5021/api/Game/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                puzzleId: puzzle.id,
                guess: guess
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.correct) {
                    setFeedback("? Correct! Score +10");
                    setScore(data.totalScore);

                    setTimeout(() => {
                        if (data.nextAvailable) {
                            setPuzzleNumber((prev) => prev + 1);
                            loadNextPuzzle();
                        } else {
                            setFinished(true);
                            setPuzzle(null);
                        }
                    }, 900);
                } else {
                    setFeedback("? Incorrect. Try again.");
                }
            })
            .catch((error) => {
                console.error("Error submitting guess:", error);
                setFeedback("Something went wrong.");
            });
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", padding: "40px" }}>
                <h2>Loading puzzle...</h2>
            </div>
        );
    }

    if (finished) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
                <div
                    style={{
                        backgroundColor: "#1d4ed8",
                        color: "white",
                        padding: "18px 40px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <div>
                        <h2 style={{ margin: 0 }}>4 Pics 1 Word</h2>
                        <p style={{ margin: "5px 0 0" }}>Pack Finished</p>
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

                <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "18px",
                            padding: "30px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
                        }}
                    >
                        <h2>Pack Finished</h2>
                        <p style={{ fontSize: "18px", marginBottom: "20px" }}>
                            Current Total Score: <strong>{score}</strong>
                        </p>

                        <button
                            onClick={() => navigate("/packs")}
                            style={primaryButton}
                        >
                            Back to Packs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                        Playing Pack #{packId} - Puzzle #{puzzleNumber}
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            backgroundColor: "rgba(255,255,255,0.18)",
                            padding: "10px 16px",
                            borderRadius: "10px",
                            fontWeight: "700"
                        }}
                    >
                        Score: {score}
                    </div>

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
                    {[puzzle.image1Url, puzzle.image2Url, puzzle.image3Url, puzzle.image4Url].map((imageUrl, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "white",
                                borderRadius: "16px",
                                overflow: "hidden",
                                minHeight: "180px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt={`Puzzle ${index + 1}`}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "cover",
                                    display: "block"
                                }}
                            />
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

export default PlayPage;