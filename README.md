# Afyatel website

The public site for the Afyatel app, served at https://afyatel.africa.

| File | What it is | How it is maintained |
|---|---|---|
| `index.html` | Landing page | By hand |
| `styles.css` | Shared styles for every page | By hand |
| `privacy-policy.html`, `terms.html`, `delete-account.html` | Legal pages | **Generated** — do not edit here. The source is `legal_content.js` in the launch-documentation pack; `node doc02_legal.js` rewrites these pages and the matching Word documents together |
| `web/*.html` | Redirects | Generated. Build 15 of the app links to `/web/<page>.html`; these keep those links working |
| `404.html` | Not-found page | By hand |

## Switching from the pilot build to Google Play

Everything is driven by the `RELEASE` object at the top of `index.html`:

- `apkUrl` — set it to offer the pilot `.apk` as a direct download.
- `playUrl` — set it on official roll-out. Every download button then points to
  Google Play and the pilot install steps disappear. Nothing else needs editing.
- Both empty — the page offers the pilot build on request, by email.

## Before the site is opened to search engines

All pages carry `<meta name="robots" content="noindex">` while the legal pages are
drafts. Remove it (in `index.html`, `404.html` and the template in `doc02_legal.js`)
once the highlighted items are confirmed and the advocate has signed off.
