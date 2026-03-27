import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Helper function to extract query params
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function AdminPuzzlesPage() {
    const query = useQuery();
    const packId = query.get("packId");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [puzzles, setPuzzles] = useState([]);
    
    // For puzzle creation
    const [answer, setAnswer] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    
    // For image selection library
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTagId, setSelectedTagId] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!packId) {
            navigate("/admin/packs");
            return;
        }
        fetchData();
    }, [packId, navigate]);

    // ITERATION 5 - Retrieve Puzzles for the specific Pack + all CMS Images and Tags for assignment
    const fetchData = async () => {
        setLoading(true);
        try {
            const [puzzlesRes, imagesRes, tagsRes] = await Promise.all([
                fetch(`http://localhost:5021/api/cms/puzzles?packId=${packId}`, { headers: { "Authorization": `Bearer ${token}` } }),
                fetch("http://localhost:5021/api/cms/images", { headers: { "Authorization": `Bearer ${token}` } }),
                fetch("http://localhost:5021/api/cms/tags", { headers: { "Authorization": `Bearer ${token}` } })
            ]);

            if (!puzzlesRes.ok || !imagesRes.ok || !tagsRes.ok) {
                throw new Error("Failed to fetch necessary data.");
            }

            setPuzzles(await puzzlesRes.json());
            setImages(await imagesRes.json());
            setTags(await tagsRes.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Toggle image selection logic
    const handleToggleImage = (url) => {
        if (selectedImages.includes(url)) {
            setSelectedImages(selectedImages.filter(i => i !== url));
        } else {
            if (selectedImages.length >= 4) {
                alert("You can only select exactly 4 images for a puzzle.");
                return;
            }
            setSelectedImages([...selectedImages, url]);
        }
    };

    // ITERATION 5 - Create Puzzle payload specifically to /cms/puzzles
    const handleCreatePuzzle = async (e) => {
        e.preventDefault();
        setError("");

        if (!answer.trim()) return setError("Answer is required.");
        if (selectedImages.length !== 4) return setError("Exactly 4 images must be selected.");

        try {
            const res = await fetch(`http://localhost:5021/api/cms/puzzles?packId=${packId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    answer: answer.trim(),
                    image1Url: selectedImages[0],
                    image2Url: selectedImages[1],
                    image3Url: selectedImages[2],
                    image4Url: selectedImages[3]
                })
            });

            if (!res.ok) throw new Error("Failed to create puzzle");
            const newPuzzle = await res.json();
            
            setPuzzles([...puzzles, newPuzzle]);
            setAnswer("");
            setSelectedImages([]); // Reset selections

        } catch (err) {
            setError(err.message);
        }
    };

    // Delete puzzle
    const handleDeletePuzzle = async (id) => {
        if (!window.confirm("Are you sure you want to delete this puzzle?")) return;
        try {
            const res = await fetch(`http://localhost:5021/api/cms/puzzles/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to delete puzzle");
            setPuzzles(puzzles.filter(p => p.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // Filter images based on selected tag dropdown
    const displayedImages = selectedTagId 
        ? images.filter(img => img.tags && img.tags.some(t => t.id === parseInt(selectedTagId)))
        : images;

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
            <div style={{ backgroundColor: "#0f172a", color: "white", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <div>
                    <h2 style={{ margin: 0 }}>Manage Puzzles</h2>
                    <p style={{ margin: "5px 0 0", opacity: 0.9 }}>Pack ID: {packId}</p>
                </div>
                <button onClick={() => navigate("/admin/packs")} style={{ padding: "10px 18px", borderRadius: "10px", backgroundColor: "white", color: "#0f172a", fontWeight: "700", border: "none", cursor: "pointer" }}>Back to Packs</button>
            </div>

            <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
                {error && <div style={{ backgroundColor: "#fee2e2", color: "#ef4444", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>{error}</div>}

                {/* Form Creation Area */}
                <div style={{ backgroundColor: "white", borderRadius: "18px", padding: "30px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: "25px" }}>
                    <h2 style={{ marginTop: 0, color: "#1e293b" }}>Add New Puzzle</h2>

                    <form onSubmit={handleCreatePuzzle}>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "5px", color: "#64748b", fontWeight: "600", fontSize: "14px" }}>Puzzle Answer Word</label>
                            <input 
                                type="text" 
                                value={answer} 
                                onChange={e => setAnswer(e.target.value)} 
                                required 
                                placeholder="Word to guess..."
                                style={{ width: "100%", maxWidth: "400px", boxSizing: "border-box", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "16px" }} 
                            />
                        </div>

                        {/* Image picker */}
                        <div style={{ marginBottom: "20px", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", backgroundColor: "#f8fafc" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                                <h3 style={{ margin: 0, color: "#1e293b" }}>
                                    Select 4 Images ({selectedImages.length}/4 selected)
                                </h3>
                                {/* Tag Filter Dropdown */}
                                <select 
                                    value={selectedTagId} 
                                    onChange={(e) => setSelectedTagId(e.target.value)}
                                    style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                >
                                    <option value="">All Tags</option>
                                    {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>

                            <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "10px" }}>
                                {displayedImages.map(img => {
                                    const isSelected = selectedImages.includes(img.url);
                                    return (
                                        <div 
                                            key={img.id} 
                                            onClick={() => handleToggleImage(img.url)}
                                            style={{ 
                                                minWidth: "120px", height: "120px",
                                                borderRadius: "12px", cursor: "pointer",
                                                backgroundImage: `url(${img.url})`, backgroundSize: "cover", backgroundPosition: "center",
                                                border: isSelected ? "4px solid #3b82f6" : "2px solid transparent",
                                                opacity: !isSelected && selectedImages.length >= 4 ? 0.4 : 1,
                                                transform: isSelected ? "scale(0.95)" : "scale(1)",
                                                transition: "0.2s"
                                            }}
                                        />
                                    );
                                })}
                                {displayedImages.length === 0 && <p style={{ color: "#94a3b8" }}>No images found.</p>}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={selectedImages.length !== 4 || !answer}
                            style={{ padding: "12px 30px", borderRadius: "10px", backgroundColor: selectedImages.length === 4 && answer ? "#10b981" : "#94a3b8", color: "white", fontWeight: "bold", border: "none", cursor: selectedImages.length === 4 && answer ? "pointer" : "not-allowed", fontSize: "16px" }}
                        >
                            Create Puzzle
                        </button>
                    </form>
                </div>

                {/* Listing Area */}
                <div style={{ backgroundColor: "white", borderRadius: "18px", padding: "30px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                    <h2 style={{ marginTop: 0, color: "#1e293b" }}>Pack Puzzles ({puzzles.length})</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : puzzles.length === 0 ? (
                        <p style={{ color: "#64748b" }}>No puzzles in this pack.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {puzzles.map(puzzle => (
                                <div key={puzzle.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px" }}>
                                    <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", width: "80px", height: "80px" }}>
                                            <img src={puzzle.image1Url} alt="1" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                                            <img src={puzzle.image2Url} alt="2" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                                            <img src={puzzle.image3Url} alt="3" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                                            <img src={puzzle.image4Url} alt="4" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: "0 0 5px 0", color: "#0f172a", fontSize: "20px", letterSpacing: "2px" }}>{puzzle.answer.toUpperCase()}</h3>
                                            <p style={{ margin: "0", color: "#64748b", fontSize: "14px" }}>Order: {puzzle.order}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={() => handleDeletePuzzle(puzzle.id)} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#ef4444", color: "white", fontWeight: "600", cursor: "pointer" }}>
                                            Delete Puzzle
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

export default AdminPuzzlesPage;
