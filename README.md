# Civics Coach

Civics Coach is a study web app for the U.S. naturalization civics test. It
walks a learner through the official question set unit by unit, then lets
them practice with quizzes, a midterm, and a full "final interview" mode.
Questions can be read aloud via text-to-speech, and answers can be given by
typing or by speaking into the microphone. Sign-in and progress are synced
to the cloud so the same account shows the same progress on any device.

## Features

- **Unit-based learning flow** — questions grouped into units, worked through
  one at a time (`src/components/UnitFlow.jsx`).
- **Quizzes / midterm / final interview** — randomized question sets with
  scoring and results screens (`src/components/Quiz.jsx`).
- **Speech support** — questions are spoken aloud with the Web Speech
  Synthesis API (`src/lib/speech.js`), and answers can be captured with the
  Web Speech Recognition API via the microphone (`src/hooks/useMic.js`).
- **Fuzzy answer checking** — spoken/typed answers are normalized and matched
  against acceptable answers rather than requiring an exact string match
  (`src/lib/textMatch.js`).
- **Accounts + progress sync** — username/passcode login backed by Firebase
  Authentication, with per-user progress stored in Firestore
  (`src/lib/firebase.js`, `src/lib/storage.js`).

## How it was built

- **React 19** for the UI, built and served with **Vite**.
- **Firebase** (Authentication + Firestore) for accounts and cross-device
  progress sync, guarded by security rules in `firestore.rules`.
- **Web Speech APIs** (`SpeechSynthesis` and `SpeechRecognition`) for the
  read-aloud and voice-answer features, wrapped in small helpers/hooks so
  the rest of the app doesn't touch the browser APIs directly.
- **Oxlint** for linting.

## Cloud sync setup (Firebase)

Sign-in and progress are stored in Firebase so the same username/passcode
shows the same progress on any browser or device. To connect your own
project:

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Build > Authentication > Get started > Sign-in method** — enable
   **Email/Password**. (The app maps your username to a fake
   `username@civicscoach.local` address under the hood so the login screen
   can stay "name + passcode.")
3. **Build > Firestore Database > Create database** — start in production
   mode (the rules below lock it down anyway).
4. In Firestore's **Rules** tab, paste the contents of `firestore.rules` from
   this repo and click **Publish**.
5. **Project settings > General > Your apps > Add app > Web**, register the
   app, and copy the `firebaseConfig` values.
6. Copy `.env.example` to `.env.local` and fill in those values.
7. Restart `npm run dev` (Vite only reads `.env*` files at startup).

Without a configured `.env.local`, the app still runs but shows "Cloud sync
isn't configured yet" on the login screen instead of connecting.
