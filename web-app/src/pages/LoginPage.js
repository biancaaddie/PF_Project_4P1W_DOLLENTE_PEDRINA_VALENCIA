import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        const normalizedEmail = email.trim();
        if (!normalizedEmail || !password || submitting) {
            setResult("Please enter both email and password.");
            return;
        }

        setSubmitting(true);
        setResult("");

        try {
            const response = await fetch("http://localhost:5151/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: normalizedEmail,
                    password
                })
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("email", data.email);
                localStorage.setItem("role", data.role);

                if (data.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/packs");
                }
            } else {
                setResult(data.message || "Login failed");
            }
        } catch (error) {
            setResult("Error connecting to server");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #dbeafe, #f1f5f9)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    padding: "35px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <h1 style={{ margin: 0, color: "#1e293b" }}>4 Pics 1 Word</h1>
                    <p style={{ color: "#64748b", marginTop: "8px" }}>
                        Login to continue
                    </p>
                </div>

                <label style={{ fontWeight: "600", color: "#334155" }}>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "16px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        outline: "none",
                        boxSizing: "border-box"
                    }}
                />

                <label style={{ fontWeight: "600", color: "#334155" }}>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "8px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        outline: "none",
                        boxSizing: "border-box"
                    }}
                />

                <button
                    onClick={handleLogin}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                    }}
                    style={{
                        width: "100%",
                        padding: "12px",
                        border: "none",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                        color: "white",
                        fontSize: "15px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "0.2s"
                    }}
                    disabled={submitting}
                >
                    {submitting ? "Signing in..." : "Login"}
                </button>

                {result && (
                    <p
                        style={{
                            marginTop: "15px",
                            textAlign: "center",
                            color: "#dc2626",
                            fontWeight: "500"
                        }}
                    >
                        {result}
                    </p>
                )}

                <p
                    style={{
                        marginTop: "18px",
                        textAlign: "center",
                        color: "#64748b"
                    }}
                >
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        style={{
                            color: "#2563eb",
                            textDecoration: "none",
                            fontWeight: "600"
                        }}
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
