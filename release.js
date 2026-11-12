// ── Release switch ────────────────────────────────────────────────────────────
// The one file to edit when a new pilot build ships or the store listing goes live.
// No rebuild needed: every page reads this at load.
//
//   playUrl set  → every download button points to Google Play and the pilot
//                  install steps disappear.
//   apkUrl set   → the pilot build is offered as a direct Android download.
//   both empty   → the site offers the pilot build on request, through Contact.
//
// apkUrl is empty until the pilot .apk has a stable home; the site then offers the
// build on request instead of showing a dead download link.
window.AFYATEL_RELEASE = {
  playUrl: '',          // on roll-out: 'https://play.google.com/store/apps/details?id=com.afyatel.app'
  apkUrl: '',
  version: '1.2.1',
  build: 15,
  updated: '12 November 2026',
  size: '',             // e.g. '68 MB'
  sha256: ''            // optional checksum of the .apk
};
