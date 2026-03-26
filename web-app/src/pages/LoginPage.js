import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:5151/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

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
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f4f6f8"
            }}
        >
            <div
                style={{
                    width: "350px",
                    padding: "30px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />

                <button
                    onClick={handleLogin}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor: "#007bff",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Login
                </button>

                {result && (
                    <p style={{ marginTop: "15px", textAlign: "center", color: "red" }}>
                        {result}
                    </p>
                )}
            </div>
        </div>
    );
}

export default LoginPage;