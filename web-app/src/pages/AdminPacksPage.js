import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPacksPage() {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Form fields for new pack
    const [newPackName, setNewPackName] = useState("");
    const [newPackDesc, setNewPackDesc] = useState("");
    const [newPackDiff, setNewPackDiff] = useState(1);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // ITERATION 5 - Load all packs (irrespective of publish status) for Admin management
    useEffect(() => {
        fetchPacks();
    }, []);

    const fetchPacks = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5021/api/cms/packs", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch packs");
            const data = await res.json();
            setPacks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ITERATION 5: Creation
    const handleCreatePack = async (e) => {
        e.preventDefault();
        setError("");
        if (!newPackName.trim()) return;

        try {
            const res = await fetch("http://localhost:5021/api/cms/packs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newPackName.trim(),
                    description: newPackDesc.trim(),
                    difficulty: parseInt(newPackDiff) || 1
                })
            });

            if (!res.ok) throw new Error("Failed to create pack");
            const newPack = await res.json();
            setPacks([...packs, newPack]);
            setNewPackName("");
            setNewPackDesc("");
            setNewPackDiff(1);
        } catch (err) {
            setError(err.message);
        }
    };

    // ITERATION 5: Deletion 
    const handleDeletePack = async (id) => {
        if (!window.confirm("Are you sure? This deletes the pack AND all its puzzles!")) return;
        try {
            const res = await fetch(`http://localhost:5021/api/cms/packs/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to delete pack");
            setPacks(packs.filter(p => p.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // ITERATION 5: Publish Status Toggle 
    const handleTogglePublish = async (id) => {
        try {
            const res = await fetch(`http://localhost:5021/api/cms/packs/${id}/publish`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to toggle publish status");
            const updatedPack = await res.json();
            setPacks(packs.map(p => p.id === id ? updatedPack : p));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
            <div style={{ backgroundColor: "#0f172a", color: "white", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <div>
                    <h2 style={{ margin: 0 }}>Manage Packs</h2>
                    <p style={{ margin: "5px 0 0", opacity: 0.9 }}>Admin Dashboard</p>
                </div>
                <button onClick={() => navigate("/admin")} style={{ padding: "10px 18px", borderRadius: "10px", backgroundColor: "white", color: "#0f172a", fontWeight: "700", border: "none", cursor: "pointer" }}>Back to Admin</button>
            </div>

            <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
                {error && <div style={{ backgroundColor: "#fee2e2", color: "#ef4444", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>{error}</div>}
                
                {/* Packs Creation */}
                <div style={{ backgroundColor: "white", borderRadius: "18px", padding: "30px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: "25px" }}>
                    <h2 style={{ marginTop: 0, color: "#1e293b" }}>Create New Pack</h2>
                    <form onSubmit={handleCreatePack} style={{ display: "flex", gap: "15px", alignItems: "flex-end", flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 auto", minWidth: "200px" }}>
                            <label style={{ display: "block", marginBottom: "5px", color: "#64748b", fontWeight: "600", fontSize: "14px" }}>Name</label>
                            <input type="text" value={newPackName} onChange={e => setNewPackName(e.target.value)} required style={{ width: "100%", boxSizing: "border-box", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                        </div>
                        <div style={{ flex: "2 1 auto", minWidth: "250px" }}>
                            <label style={{ display: "block", marginBottom: "5px", color: "#64748b", fontWeight: "600", fontSize: "14px" }}>Description</label>
                            <input type="text" value={newPackDesc} onChange={e => setNewPackDesc(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                        </div>
                        <div style={{ flex: "0 0 100px" }}>
                            <label style={{ display: "block", marginBottom: "5px", color: "#64748b", fontWeight: "600", fontSize: "14px" }}>Difficulty (1-10)</label>
                            <input type="number" min="1" max="10" value={newPackDiff} onChange={e => setNewPackDiff(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                        </div>
                        <button type="submit" style={{ padding: "10px 24px", borderRadius: "8px", backgroundColor: "#2563eb", color: "white", fontWeight: "bold", border: "none", cursor: "pointer", height: "42px" }}>Create</button>
                    </form>
                </div>

                {/* Pack Listing */}
                <div style={{ backgroundColor: "white", borderRadius: "18px", padding: "30px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                    <h2 style={{ marginTop: 0, color: "#1e293b" }}>Existing Packs ({packs.length})</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : packs.length === 0 ? (
                        <p style={{ color: "#64748b" }}>No packs created yet.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {packs.map(pack => (
                                <div key={pack.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", backgroundColor: "#f8fafc" }}>
                                    <div>
                                        <h3 style={{ margin: "0 0 5px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
                                            {pack.name}
                                            <span style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "20px", backgroundColor: pack.isPublished ? "#dcfce7" : "#f1f5f9", color: pack.isPublished ? "#16a34a" : "#64748b", fontWeight: "bold" }}>
                                                {pack.isPublished ? "PUBLISHED" : "DRAFT"}
                                            </span>
                                        </h3>
                                        <p style={{ margin: "0 0 10px 0", color: "#64748b", fontSize: "14px" }}>{pack.description} • Diff: {pack.difficulty}</p>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        {/* Managing puzzles directs the user to our newest iteration 5 AdminPuzzlesPage mapping route */}
                                        <button onClick={() => navigate(`/admin/puzzles?packId=${pack.id}`)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #2563eb", backgroundColor: "white", color: "#2563eb", fontWeight: "600", cursor: "pointer" }}>
                                            Manage Puzzles
                                        </button>
                                        <button onClick={() => handleTogglePublish(pack.id)} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: pack.isPublished ? "#f59e0b" : "#10b981", color: "white", fontWeight: "600", cursor: "pointer" }}>
                                            {pack.isPublished ? "Unpublish" : "Publish"}
                                        </button>
                                        <button onClick={() => handleDeletePack(pack.id)} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#ef4444", color: "white", fontWeight: "600", cursor: "pointer" }}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminPacksPage;
