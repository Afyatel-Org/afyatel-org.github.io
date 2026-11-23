// ── Release switch ────────────────────────────────────────────────────────────
// The one file to edit when a new pilot build ships or the store listing goes live.
// No rebuild needed: every page reads this at load.
//
//   playUrl set  → every download button points to Google Play and the pilot
//                  install steps disappear.
//   apkUrl set   → the pilot build is offered as a direct Android download.
//   both empty   → the site offers the pilot build on request, through Contact.
//
// The pilot .apk is 161 MB, over the 100 MB a repository file may be, so it is
// published as a release download on the site's GitHub repository.
window.AFYATEL_RELEASE = {
  playUrl: '',          // on roll-out: 'https://play.google.com/store/apps/details?id=com.afyatel.app'
  apkUrl: 'https://github.com/Afyatel-Org/afyatel-org.github.io/releases/download/app-1.5.0-24/Afyatel-1.5.0.apk',
  version: '1.5.0',
  build: 24,
  updated: '23 November 2026',
  size: '161 MB',
  sha256: '762574210308ca8f0783bc5ede50c9912d3b9fbbbeeb29e60c89395bddfb2382'
};
