/**
 * Small line drawn icons that draw themselves once as their card enters view
 * (CSS .li-draw in globals.css, stroke dash animation). Chosen by keyword
 * from the text they sit beside, so a service body needs no icon markup.
 */
export type IconName =
  | "key"
  | "stamp"
  | "home"
  | "search"
  | "rupee"
  | "shield"
  | "ruler"
  | "file"
  | "handshake"
  | "building"
  | "water"
  | "car"
  | "phone"
  | "check";

const PATHS: Record<IconName, string> = {
  key: "M7 14a5 5 0 1 1 4.6-3H21v3h-3v3h-3v-3h-3.4A5 5 0 0 1 7 14zm0-2a2 2 0 1 0 0 .01",
  stamp: "M9 4h6v6l2 2v2H7v-2l2-2zM5 16h14v2H5zM8 20h8",
  home: "M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6",
  search: "M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM16 16l5 5",
  rupee: "M6 4h12M6 8h12M9 4c6 0 6 6 0 6H6l8 10",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4",
  ruler: "M3 17L17 3l4 4L7 21zM8 16l2 2M11 13l2 2M14 10l2 2",
  file: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  handshake: "M3 11l4-4 4 3 3-3 4 4-2 2M7 14l3 3 2-1 2 2 2-1 3-3M3 11l4 4",
  building: "M4 21V5l7-2v18M11 21V9l9-2v14M7 8h1M7 12h1M7 16h1M15 12h1M15 16h1",
  water: "M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11zM9 15a3 3 0 0 0 3 3",
  car: "M4 14l2-5h12l2 5v5H4zM4 14h16M7 19v2M17 19v2M7 16h.01M17 16h.01",
  phone: "M5 4h4l2 5-2 1a9 9 0 0 0 5 5l1-2 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  check: "M4 12l5 5L20 6",
};

export function pickIcon(text: string): IconName {
  const t = text.toLowerCase();
  if (/(key|possession|handover|move in|keys)/.test(t)) return "key";
  if (/(noc|permission|stamp|board|regularis|estate manager|registration)/.test(t)) return "stamp";
  if (/(carpet|measure|area|square)/.test(t)) return "ruler";
  if (/(duty|rupee|price|rent|fee|cost|estimate|yield|payment)/.test(t)) return "rupee";
  if (/(title|file|document|paper|agreement|encumbrance|index)/.test(t)) return "file";
  if (/(water|pressure)/.test(t)) return "water";
  if (/(parking|car)/.test(t)) return "car";
  if (/(verify|verified|owner|society|check|welcome)/.test(t)) return "shield";
  if (/(negotiat|agree|deal|tenant|match)/.test(t)) return "handshake";
  if (/(building|tower|floor|launch|society|project|redevelop|design|civil)/.test(t)) return "building";
  if (/(shortlist|search|find|pocket)/.test(t)) return "search";
  if (/(call|whatsapp|phone|tell us)/.test(t)) return "phone";
  return "check";
}

export function LineIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`li-draw h-7 w-7 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
