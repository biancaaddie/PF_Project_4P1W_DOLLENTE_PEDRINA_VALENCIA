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
    const [restarting, setRestarting] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [pageError, setPageError] = useState("");

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
        setPageError("");

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
            .catch((loadError) => {
                console.error("Error loading next puzzle:", loadError);
                setPuzzle(null);
                setFinished(true);
                setPageError("No more puzzles available in this pack right now.");
                setLoading(false);
            });
    };

    useEffect(() => {
        setScore(0);
        setPuzzleNumber(1);
        loadNextPuzzle();
    }, [packId]);

    const handleSubmit = () => {
        const normalizedGuess = guess.trim();
        if (!puzzle || !normalizedGuess || submitting) return;
        setSubmitting(true);
        setFeedback("");

        fetch("http://localhost:5021/api/Game/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                puzzleId: puzzle.id,
                guess: normalizedGuess
            })
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to submit guess.");
                }

                return data;
            })
            .then((data) => {
                if (data.correct) {
                    setFeedback("Correct! Score +10");
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
                    setFeedback("Incorrect. Try again.");
                }
            })
            .catch((submitError) => {
                console.error("Error submitting guess:", submitError);
                setFeedback(submitError.message || "Something went wrong.");
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleRestartPack = () => {
        setRestarting(true);

        fetch(`http://localhost:5021/api/Game/restart?packId=${packId}`, {
            method: "POST"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to restart pack");
                }
                return response.json();
            })
            .then(() => {
                setFinished(false);
                setPuzzle(null);
                setFeedback("");
                setGuess("");
                setScore(0);
                setPuzzleNumber(1);
                loadNextPuzzle();
            })
            .catch((restartError) => {
                console.error("Error restarting pack:", restartError);
                setFeedback("Failed to restart pack.");
            })
            .finally(() => {
                setRestarting(false);
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
                        {pageError && <p style={{ color: "#475569" }}>{pageError}</p>}
                        <p style={{ fontSize: "18px", marginBottom: "20px" }}>
                            Current Total Score: <strong>{score}</strong>
                        </p>

                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            <button onClick={handleRestartPack} style={primaryButton} disabled={restarting}>
                                {restarting ? "Restarting..." : "Restart Pack"}
                            </button>

                            <button
                                onClick={() => navigate("/packs")}
                                style={secondaryButton}
                            >
                                Choose Different Pack
                            </button>
                        </div>
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
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSubmit();
                            }
                        }}
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
                        <button
                            onClick={handleSubmit}
                            style={primaryButton}
                            disabled={submitting || guess.trim().length === 0}
                        >
                            {submitting ? "Submitting..." : "Submit Guess"}
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
