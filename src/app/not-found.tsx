/**
 * Root-level not-found page. Required because this app has two independent
 * root layouts (src/app/[locale]/layout.tsx and src/app/studio/layout.tsx)
 * with no shared app/layout.tsx above them — Next.js has no single layout to
 * compose a global 404 from otherwise, and falls back to malformed markup
 * for any URL that matches no route at all (e.g. a stray /favicon.ico
 * request). This file provides its own complete <html>/<body> document so
 * that case is handled cleanly.
 */
export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1>404 — Page not found</h1>
        <p>
          <a href="/">Return home</a>
        </p>
      </body>
    </html>
  );
}
