// ── Release switch ────────────────────────────────────────────────────────────
// The one file to edit when a new pilot build ships or the store listing goes live.
// No rebuild needed: every page reads this at load.
//
//   playUrl set  → every download button points to Google Play and the pilot
//                  install steps disappear.
//   apkUrl set   → the pilot build is offered as a direct Android download.
//   both empty   → the site offers the pilot build on request, through Contact.
//
// The pilot .apk is 106 MB, over the 100 MB a repository file may be, so it is
// published as a release download on the site's GitHub repository.
window.AFYATEL_RELEASE = {
  playUrl: '',          // on roll-out: 'https://play.google.com/store/apps/details?id=com.afyatel.app'
  apkUrl: 'https://github.com/Afyatel-Org/afyatel-org.github.io/releases/download/app-1.2.1-21/Afyatel-1.2.1.apk',
  version: '1.2.1',
  build: 21,
  updated: '12 November 2026',
  size: '106 MB',
  sha256: 'ea3b5f46537b02fc27c05062f2b3a57c3e55bf23641d1df73b59ddc6a733bbac'
};
