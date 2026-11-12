# Afyatel website

The public site for the Afyatel app, served at https://afyatel.africa.

**This folder is build output.** The pages are generated; edit the sources, then rebuild.

| Output | Source | Rebuild with |
|---|---|---|
| `index.html`, `services/*.html`, `how-it-works.html`, `providers.html`, `about.html`, `help.html`, `contact.html`, `404.html` | `_build/site/` in the launch-documentation pack: `build.js` (pages), `content.js` (services, help answers), `phone.js` (the interactive walkthrough), `ui.js` (header, footer, icons), `config.js` (contact details) | `node site/build.js` |
| `privacy-policy.html`, `terms.html`, `delete-account.html`, `web/*.html` | `_build/legal_content.js`, which also produces the Word documents | `node doc02_legal.js` |
| `styles.css`, `site.js`, `release.js`, `img/`, icons | Maintained here by hand | — |

`web/*.html` are redirects: build 15 of the app links to `/web/<page>.html`, and these keep those links working.

## Addresses

Links inside the site have no `.html` (`/how-it-works`, `/services/pharmacy`); the host
serves each from the matching `.html` file, so the longer addresses also work.
`services.html` and `demo.html` are redirects from earlier addresses. To preview
locally with the same behaviour: `python site/serve.py` from `_build`.

## Switching from the pilot build to Google Play

Edit `release.js`. No rebuild is needed; every page reads it at load.

- `apkUrl` — set it to offer the pilot `.apk` as a direct download.
- `playUrl` — set it on official roll-out. Every download button then points to
  Google Play and the pilot install steps disappear.
- Both empty — the site offers the pilot build on request, through Contact.

## Contact details

`_build/site/config.js` holds the address, email, and the optional `phone` and
`whatsapp` numbers. Phone and WhatsApp options appear on the Contact page and in
the footer only when those are set.

## The walkthrough

`/how-it-works#see-a-doctor` opens a journey; `/how-it-works#see-a-doctor/4` opens it at step 4.
Journey ids: `see-a-doctor`, `order-medicine`, `book-a-lab-test`, `join-afyatel`,
`run-a-consultation`, `fulfil-an-order`, `return-a-lab-result`.

## Before the site is opened to search engines

Every page carries `noindex` while the legal pages are drafts. Set `noindex: false`
in `_build/site/config.js` and rebuild once the highlighted items are confirmed and
the advocate has signed off.
