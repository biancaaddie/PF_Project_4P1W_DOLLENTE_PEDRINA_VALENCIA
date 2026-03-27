import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminImagesPage() {
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);
    
    // Form states
    const [uploadUrl, setUploadUrl] = useState("");
    const [uploadName, setUploadName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMode, setUploadMode] = useState("url"); // 'url' or 'file'

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // Load images and tags from the backend
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            // Promise.all to load both simultaneously
            const [imagesRes, tagsRes] = await Promise.all([
                fetch("http://localhost:5021/api/cms/images", { headers: { "Authorization": `Bearer ${token}` } }),
                fetch("http://localhost:5021/api/cms/tags", { headers: { "Authorization": `Bearer ${token}` } })
            ]);

            if (!imagesRes.ok) throw new Error("Failed to fetch images");
            if (!tagsRes.ok) throw new Error("Failed to fetch tags");

            const imagesData = await imagesRes.json();
            const tagsData = await tagsRes.json();

            setImages(imagesData);
            setTags(tagsData);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Upload an image URL
    const handleUrlUpload = async (e) => {
        e.preventDefault();
        if (!uploadUrl.trim()) return;

        setError("");
        try {
            const res = await fetch("http://localhost:5021/api/cms/images/from-url", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ url: uploadUrl.trim(), name: uploadName.trim() })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to upload from URL");
            }

            const newImage = await res.json();
            setImages([newImage, ...images]); // Prepend new image
            setUploadUrl("");
            setUploadName("");
        } catch (err) {
            setError(err.message);
        }
    };

    // Upload a physical file using FormData
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setError("");
        const formData = new FormData();
        formData.append("file", selectedFile);
        if (uploadName) {
            formData.append("name", uploadName.trim());
        }

        try {
            const res = await fetch("http://localhost:5021/api/cms/images/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}` // No Content-Type header so browser sets multipart/form-data with boundary
                },
                body: formData
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to upload file");
            }

            const newImage = await res.json();
            setImages([newImage, ...images]);
            setSelectedFile(null);
            setUploadName("");
            
            // Clear file input
            const fileInput = document.getElementById('fileUploadInput');
            if (fileInput) fileInput.value = '';

        } catch (err) {
            setError(err.message);
        }
    };

    // Delete an image entirely
    const handleDeleteImage = async (id) => {
        if (!window.confirm("Delete this image? It will be removed from all assigned puzzles.")) return;
        
        try {
            const res = await fetch(`http://localhost:5021/api/cms/images/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to delete image");

            // Remove it from the UI after success
            setImages(images.filter(img => img.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // Tag an image
    const handleAddTagToImage = async (imageId, tagId) => {
        try {
            const res = await fetch(`http://localhost:5021/api/cms/images/${imageId}/tags`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ tagId: parseInt(tagId) })
            });

            if (!res.ok) throw new Error("Failed to add tag");

            // Refresh data or update local state
            // It's cleaner to just update local state to avoid full re-flushes
            const tagObj = tags.find(t => t.id === parseInt(tagId));
            if (tagObj) {
                setImages(images.map(img => {
                    if (img.id === imageId && !img.tags.some(t => t.id === tagObj.id)) {
                        return { ...img, tags: [...img.tags, tagObj].sort((a,b) => a.name.localeCompare(b.name)) };
                    }
                    return img;
                }));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // Remove a tag from an image
    const handleRemoveTagFromImage = async (imageId, tagId) => {
        try {
            const res = await fetch(`http://localhost:5021/api/cms/images/${imageId}/tags/${tagId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to remove tag");

            // Update local state
            setImages(images.map(img => {
                if (img.id === imageId) {
                    return { ...img, tags: img.tags.filter(t => t.id !== tagId) };
                }
                return img;
            }));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
            {/* Header Section */}
            <div style={{ backgroundColor: "#0f172a", color: "white", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <div>
                    <h2 style={{ margin: 0 }}>Manage Images</h2>
                    <p style={{ margin: "5px 0 0", opacity: 0.9 }}>Admin Dashboard</p>
                </div>
                <button onClick={() => navigate("/admin")} style={{ padding: "10px 18px", borderRadius: "10px", backgroundColor: "white", color: "#0f172a", fontWeight: "700", border: "none", cursor: "pointer" }}>Back to Admin</button>
            </div>

            <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
                {error && <div style={{ backgroundColor: "#fee2e2", color: "#ef4444", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>{error}</div>}

                {/* Upload Section */}
                <div style={{ backgroundColor: "white", borderRadius: "18px", padding: "30px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: "25px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ margin: 0, color: "#1e293b" }}>Upload Image</h2>
                        
                        {/* URL vs File toggle */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={() => setUploadMode("url")}
                                style={{ padding: "8px 16px", borderRadius: "20px", border: "1px solid #2563eb", background: uploadMode === "url" ? "#2563eb" : "transparent", color: uploadMode === "url" ? "white" : "#2563eb", cursor: "pointer", fontWeight: "600" }}
                            >
                                From URL
                            </button>
                            <button
                                onClick={() => setUploadMode("file")}
                                style={{ padding: "8px 16px", borderRadius: "20px", border: "1px solid #2563eb", background: uploadMode === "file" ? "#2563eb" : "transparent", color: uploadMode === "file" ? "white" : "#2563eb", cursor: "pointer", fontWeight: "600" }}
                            >
                                File Upload
                            </button>
                        </div>
                    </div>

                    {uploadMode === "url" ? (
                        <form onSubmit={handleUrlUpload} style={{ display: "flex", gap: "15px", alignItems: "flex-start", flexWrap: "wrap", flexDirection: "column" }}>
                            <input
                                type="url"
                                placeholder="Public Image URL (https://...)"
                                value={uploadUrl}
                                required
                                onChange={(e) => setUploadUrl(e.target.value)}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "16px" }}
                            />
                            <div style={{ display: "flex", gap: "15px", width: "100%" }}>
                                <input
                                    type="text"
                                    placeholder="Optional Label / Name"
                                    value={uploadName}
                                    onChange={(e) => setUploadName(e.target.value)}
                                    style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "16px" }}
                                />
                                <button type="submit" style={{ padding: "12px 24px", borderRadius: "8px", backgroundColor: "#10b981", color: "white", fontWeight: "bold", border: "none", cursor: "pointer", minWidth: "150px" }}>
                                    Add Image
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleFileUpload} style={{ display: "flex", gap: "15px", alignItems: "flex-start", flexWrap: "wrap", flexDirection: "column" }}>
                            <input
                                id="fileUploadInput"
                                type="file"
                                accept="image/*"
                                required
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px dashed #94a3b8", fontSize: "16px", cursor: "pointer" }}
                            />
                            <div style={{ display: "flex", gap: "15px", width: "100%" }}>
                                <input
                                    type="text"
                                    placeholder="Optional Label / Name"
                                    value={uploadName}
                                    onChange={(e) => setUploadName(e.target.value)}
                                    style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "16px" }}
                                />
                                <button type="submit" style={{ padding: "12px 24px", borderRadius: "8px", backgroundColor: "#10b981", color: "white", fontWeight: "bold", border: "none", cursor: "pointer", minWidth: "150px" }}>
                                    Upload File
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Images Gallery */}
                <div>
                    <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>Image Library ({images.length})</h2>
                    {loading ? (
                        <p>Loading gallery...</p>
                    ) : images.length === 0 ? (
                        <p style={{ color: "#64748b" }}>No images uploaded yet.</p>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
                            {images.map(img => (
                                <div key={img.id} style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", position: "relative" }}>
                                    
                                    {/* Delete Button on top right */}
                                    <button
                                        onClick={() => handleDeleteImage(img.id)}
                                        style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "rgba(239, 68, 68, 0.9)", color: "white", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", zIndex: 10 }}
                                        title="Delete image"
                                    >
                                        &times;
                                    </button>

                                    {/* Image Preview */}
                                    <div style={{ height: "200px", backgroundColor: "#e2e8f0", backgroundImage: `url(${img.url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                                    
                                    <div style={{ padding: "16px" }}>
                                        <h4 style={{ margin: "0 0 10px 0", color: "#1e293b", wordBreak: "break-all" }}>{img.name || `Image #${img.id}`}</h4>
                                        <p style={{ margin: "0 0 15px 0", fontSize: "12px", color: "#94a3b8" }}>
                                            {new Date(img.createdAtUtc).toLocaleDateString()}
                                        </p>

                                        {/* Assigned Tags rendering (Chips) */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px" }}>
                                            {img.tags && img.tags.length > 0 ? (
                                                img.tags.map(tag => (
                                                    <span key={tag.id} style={{ backgroundColor: "#dbeafe", color: "#1d4ed8", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
                                                        {tag.name}
                                                        <span onClick={() => handleRemoveTagFromImage(img.id, tag.id)} style={{ cursor: "pointer", color: "#3b82f6", fontWeight: "bold" }}>&times;</span>
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>No tags assigned</span>
                                            )}
                                        </div>

                                        {/* Tag Assigner Select */}
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <select 
                                                style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                                                onChange={(e) => {
                                                    if(e.target.value) {
                                                        handleAddTagToImage(img.id, e.target.value);
                                                        e.target.value = ""; // Reset after mapping
                                                    }
                                                }}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Add a tag...</option>
                                                {tags
                                                    .filter(t => !img.tags.some(it => it.id === t.id)) // Only show currently unassigned tags
                                                    .map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
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

export default AdminImagesPage;
