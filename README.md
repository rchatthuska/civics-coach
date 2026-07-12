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

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
