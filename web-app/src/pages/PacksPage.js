function PacksPage() {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    return (
        <div style={{ padding: "50px" }}>
            <h2>Packs Page</h2>
            <p>Welcome: {email}</p>
            <p>Role: {role}</p>
        </div>
    );
}

export default PacksPage;