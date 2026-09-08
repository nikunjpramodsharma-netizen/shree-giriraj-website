/**
 * The About page's readiness gate and the questions still outstanding.
 *
 * This lives in a library rather than inside the route because two places need
 * to agree about it: the page, which decides whether to emit noindex, and the
 * sitemap, which must not advertise a URL that is noindexed. Those two sat in
 * different files and drifted, so /about was submitted for indexing and told
 * Google not to index it in the same breath.
 *
 * Flip STORY_IS_WRITTEN the moment the prompts below are answered and the prose
 * replaces them. Nothing else needs changing: the page drops its draft notice
 * and the sitemap picks the URL up on the next build.
 */

export const STORY_IS_WRITTEN = false;

export type StorySection = { heading: string; prompts: string[] };

export const STORY_PROMPTS: StorySection[] = [
  {
    heading: "How it started",
    prompts: [
      "Who started it in 1996, and what were they doing before?",
      "What did Borivali look like as a property market then, compared with now?",
      "Was there a moment early on that set how you work?",
    ],
  },
  {
    heading: "How we work, and why",
    prompts: [
      "What do you do differently from a portal or a larger agency?",
      "What kind of client do you work best with, and who are you not for?",
      "Is there a deal you turned down, and why? That single answer would do more for trust than anything else on this page.",
    ],
  },
  {
    heading: "What has changed since 1996",
    prompts: [
      "What has RERA actually changed for a buyer here?",
      "What do people get wrong now that they did not get wrong before?",
    ],
  },
];
