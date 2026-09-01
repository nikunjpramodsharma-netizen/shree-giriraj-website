import { Link } from "@/i18n/navigation";

export type Crumb = { name: string; path: string };

/**
 * Visible breadcrumbs, paired with BreadcrumbList markup on the same pages.
 *
 * They exist for two reasons beyond navigation: they mirror the URL hierarchy,
 * and they are free internal links on every page below the top level. Marking
 * up a trail that is not rendered would break the accuracy first rule, so this
 * component and the schema are always added together.
 *
 * The last crumb is the current page and is not a link.
 */
export function Breadcrumbs({
  trail,
  tone = "light",
}: {
  trail: Crumb[];
  tone?: "light" | "dark";
}) {
  if (trail.length < 2) return null;
  const muted = tone === "dark" ? "text-paper/60" : "text-muted";
  const current = tone === "dark" ? "text-paper" : "text-brand-indigo";

  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${muted}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span className={current} aria-current="page">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="hover:underline">
                    {c.name}
                  </Link>
                  <span aria-hidden="true" className="opacity-50">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
