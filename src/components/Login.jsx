import { useState } from "react";
import { cloudUnavailable, signIn, signUp } from "../lib/storage";

export function Login({ onLogin }) {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const name = username.trim();
    if (!name || !passcode) {
      setError("Enter a name and a passcode.");
      return;
    }
    if (cloudUnavailable()) {
      setError(
        "Cloud sync isn't configured yet — see .env.example to set up Firebase.",
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      const user =
        mode === "signup"
          ? await signUp(name, passcode)
          : await signIn(name, passcode);
      onLogin(user);
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  };

  return (
    <div className="card login-card">
      <h2 className="q-text">
        {mode === "signup" ? "Create your profile" : "Welcome back"}
      </h2>
      <p className="login-note">
        Each person gets their own name and passcode (6+ characters).
        Progress syncs to the cloud, so signing in with the same name and
        passcode on any browser or device picks up right where you left off.
      </p>
      {error && <p className="warn">{error}</p>}
      <div className="login-field">
        <label>Name</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. Bobby"
          autoFocus
        />
      </div>
      <div className="login-field">
        <label>Passcode</label>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Choose or enter a passcode"
        />
      </div>
      <button className="primary" onClick={submit} disabled={busy}>
        {mode === "signup" ? "Create profile" : "Sign in"}
      </button>
      <button
        className="ghost small"
        onClick={() => {
          setMode(mode === "signup" ? "signin" : "signup");
          setError("");
        }}
      >
        {mode === "signup"
          ? "Already have a profile? Sign in"
          : "New here? Create a profile"}
      </button>
    </div>
  );
}
