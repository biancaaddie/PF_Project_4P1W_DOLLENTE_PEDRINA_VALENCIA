import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminTagsPage() {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Get the auth token from local storage
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchTags();
    }, []);

    // Fetch all existing tags from the backend
    const fetchTags = () => {
        setLoading(true);
        fetch("http://localhost:5021/api/cms/tags", {
            headers: {
                "Authorization": `Bearer ${token}` // Provide admin token
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to load tags");
            return res.json();
        })
        .then(data => {
            setTags(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });
    };

    // Create a new tag
    const handleCreateTag = (e) => {
        e.preventDefault();
        setError("");
        
        if (!newTagName.trim()) {
            setError("Tag name cannot be empty");
            return;
        }

        fetch("http://localhost:5021/api/cms/tags", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Provide admin token
            },
            body: JSON.stringify({ name: newTagName.trim() })
        })
        .then(res => {
            if (res.status === 409) throw new Error("Tag already exists");
            if (!res.ok) throw new Error("Failed to create tag");
            return res.json();
        })
        .then(data => {
            // Add new tag to the list visually
            setTags([...tags, data]);
            setNewTagName("");
        })
        .catch(err => {
            setError(err.message);
        });
    };

    // Delete a tag
    const handleDeleteTag = (id) => {
        if (!window.confirm("Are you sure you want to delete this tag? Images using this tag will be untagged.")) return;
        
        fetch(`http://localhost:5021/api/cms/tags/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}` // Provide admin token
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to delete tag");
            // Remove the deleted tag from the list visually
            setTags(tags.filter(t => t.id !== id));
        })
        .catch(err => {
            setError(err.message);
        });
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
            {/* Header Section */}
            <div style={{ backgroundColor: "#0f172a", color: "white", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <div>
                    <h2 style={{ margin: 0 }}>Manage Tags</h2>
                    <p style={{ margin: "5px 0 0", opacity: 0.9 }}>Admin Dashboard</p>
                </div>
                <button onClick={() => navigate("/admin")} style={{ padding: "10px 18px", borderRadius: "10px", backgroundColor: "white", color: "#0f172a", fontWeight: "700", border: "none", cursor: "pointer" }}>Back to Admin</button>
            </div>

            <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
                {/* Error Banner */}
                {error && <div style={{ backgroundColor: "#fee2e2", color: "#ef4444", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>{error}</div>}
                
                {/* Tag Creation Form */}
                <div style={{ backgroundColor: "white", borderRadius: "18px", padding: "30px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: "25px" }}>
                    <h2 style={{ marginTop: 0, color: "#1e293b" }}>Create New Tag</h2>
                    <form onSubmit={handleCreateTag} style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                        <input
                            type="text"
                            placeholder="e.g. animal, vehicle..."
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "16px" }}
                        />
                        <button type="submit" style={{ padding: "12px 24px", borderRadius: "8px", backgroundColor: "#2563eb", color: "white", fontWeight: "bold", border: "none", cursor: "pointer" }}>
                            Create Tag
                        </button>
                    </form>
                </div>

                {/* Tags List View */}
                <div style={{ backgroundColor: "white", borderRadius: "18px", padding: "30px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                    <h2 style={{ marginTop: 0, color: "#1e293b" }}>Existing Tags</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : tags.length === 0 ? (
                        <p style={{ color: "#64748b" }}>No tags found.</p>
                    ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {tags.map(tag => (
                                <div key={tag.id} style={{ display: "flex", alignItems: "center", backgroundColor: "#f3f4f6", padding: "8px 16px", borderRadius: "20px", border: "1px solid #e5e7eb" }}>
                                    <span style={{ marginRight: "10px", fontWeight: "600", color: "#374151" }}>{tag.name}</span>
                                    <button
                                        onClick={() => handleDeleteTag(tag.id)}
                                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px", padding: 0, display: "flex", alignItems: "center" }}
                                        title="Delete tag"
                                    >
                                        &times; {/* Cross icon */}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminTagsPage;
