/**
 * Renders a JSON-LD graph as a script tag.
 *
 * Server rendered on purpose: crawlers and AI agents that do not execute
 * JavaScript still need to see it, which is the whole point of having it.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own typed builders, never from user
      // input, so there is nothing to escape beyond closing the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
