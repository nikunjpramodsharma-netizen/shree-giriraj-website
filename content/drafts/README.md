# Post drafts

Drafts awaiting review, before they go into Sanity.

## How to read the markers

| Marker | Means |
|---|---|
| `[ VERIFY ]` | A factual claim I could not confirm from a primary source. Check it or cut it. Nothing carrying this marker should publish |
| `[ YOUR WORDS ]` | A section only you can write. Usually a local specific. Roughly one per post is the minimum |
| `[ DECISION ]` | Something blocked on a commercial choice you have not made yet, such as whether to publish cost bands |

## Workflow

1. Read the draft, resolve every marker
2. Send it back, or edit in place
3. I move it into Sanity with the answer block, sources and category set
4. Flip `JOURNAL_POSTS_READY` in `src/lib/homepage-content.ts` on the first publish

## Status

| File | Cluster | Target keyword | Volume | Blocked on |
|---|---|---|---|---|
| `carpet-area-vs-built-up-area.md` | Buying | carpet area vs built up area | 3,600 | Verification only |
| `choosing-an-interior-designer-in-borivali.md` | Interiors | interior designer borivali | 480 | Your fee position, cost bands |
| `the-ten-month-deposit-in-borivali.md` | Renting | none measured | none | Your words, most of it |
