export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "60vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1>404 — Page not found</h1>
      <p>
        <a href="/">Return home</a>
      </p>
    </div>
  );
}
