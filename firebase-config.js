// Garage Log — Firebase config
//
// 1. In the Firebase console, open (or create) your project.
// 2. Build > Firestore Database > Create database (production mode is fine — the
//    security rules in README.md lock it down).
// 3. Build > Authentication > Sign-in method > enable "Anonymous".
// 4. Project settings (gear icon) > General > "Your apps" > add a Web app >
//    copy the firebaseConfig object it gives you into GARAGE_LOG_FIREBASE_CONFIG below.
// 5. Change GARAGE_LOG_SYNC_CODE to any private string only you know — it's the
//    path your devices share, not a security boundary by itself (see README).
//
// Leave GARAGE_LOG_FIREBASE_CONFIG as null to run the app in local-only mode
// (no cross-device sync, data just stays in this browser's storage).

window.GARAGE_LOG_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDSzZ8TTEt0vuQFVzPF3RADVw8PTkg_yLM",
  authDomain: "workout-regiment.firebaseapp.com",
  projectId: "workout-regiment",
  storageBucket: "workout-regiment.firebasestorage.app",
  messagingSenderId: "1070620968820",
  appId: "1:1070620968820:web:b1756f50480341abb74e21"
};

window.GARAGE_LOG_SYNC_CODE = "nick-garage-e4d253";