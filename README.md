# Garage Log — PWA

An installable, offline-capable workout tracker for the garage strength program (Day A/B/C), matching `garage-strength-program.md` in your "Working out" project. Ships in two modes:

- **Local only** (default, no setup): data is saved with the browser's local storage on whatever device it's installed on. Works immediately, doesn't sync between devices.
- **Synced via Firebase**: fill in `firebase-config.js` and every device that opens the app reads and writes the same log in real time, with offline queueing (Firestore keeps working with no connection and syncs once you're back online).

## 1. Deploy to GitHub Pages

1. Create a repo (e.g. `garage-log`) and push everything in this folder to it: `index.html`, `manifest.json`, `sw.js`, `firebase-config.js`, `icons/`.
2. Repo → Settings → Pages → Source: deploy from the `main` branch, root folder.
3. Your app is live at `https://<username>.github.io/garage-log/`.

Every path in the app is relative (`./...`), so it works fine whether it's a project site (`/garage-log/`) or a user/organization root site.

## 2. Turn on Firebase sync

You've already got a Firebase account, so:

1. **console.firebase.google.com** → open or create a project.
2. **Build → Firestore Database → Create database.** Production mode is fine — the security rules below lock it down; start location doesn't matter much for this.
3. **Build → Authentication → Sign-in method → enable "Anonymous."** This app signs each device in anonymously just so Firestore has *some* authenticated caller — there's no login screen or password.
4. **Project settings (gear icon) → General → "Your apps" → Add app → Web (`</>`).** Register it (nickname doesn't matter, skip Hosting), and it'll show you a `firebaseConfig` object.
5. Open `firebase-config.js` in this folder and paste that object into `GARAGE_LOG_FIREBASE_CONFIG` (uncomment the block, delete the `= null;` line above it).
6. Change `GARAGE_LOG_SYNC_CODE` to any string only you know (e.g. a nickname, not "garage-log"). All your devices need to share this exact string — it's the path they all read/write under.
7. **Firestore Database → Rules**, replace the default rules with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /households/{code}/sessions/{sessionId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

   This means: anyone signed in (anonymous sign-in counts) can read/write session data. It does **not** check that they know your specific `code` — so treat `GARAGE_LOG_SYNC_CODE` and your Firebase project like a shared secret (obscure, not published anywhere), not a real access-controlled login. That's a reasonable tradeoff for a personal fitness log; if you ever want it properly locked to just you, the next step up is switching Anonymous auth for Google/email sign-in and adding `request.auth.uid == <your uid>` to the rule — say the word if you want that wired up instead.

8. Commit and push `firebase-config.js` with your real values, redeploy (GitHub Pages picks it up automatically on push). Firebase config values are meant to be public in client apps (they're not secrets — your security rules are what actually protects the data), so it's fine for this file to be in the repo.
9. Open the app on a couple of devices — the little dot next to "Garage Log" in the header shows the sync state (Local only / Connecting… / Synced / Offline — will sync).

## Install it on your phone

Once it's live at your GitHub Pages URL:
- **Android (Chrome):** open the URL — you'll see an "Install" banner in the app, or use Chrome's menu → "Add to Home screen" / "Install app".
- **iPhone (Safari):** open the URL, tap the Share icon, then "Add to Home Screen". iOS doesn't support the automatic install prompt, so this manual step is how it becomes a real installed PWA there.

After installing, it opens full-screen with its own icon. The service worker (`sw.js`) caches the app shell so it keeps working offline; if Firebase sync is on, Firestore's own offline cache keeps your logged sets available and queues writes until you're back online.

## Updating the program later

Program data lives in the `PROGRAM` object near the top of the `<script type="module">` block in `index.html`. Edit it and push — GitHub Pages redeploys automatically, and the service worker picks up the new version next time the app opens with a connection.
