import { useState } from "react";
import { hashPass, loadUsers, saveUsers } from "../lib/storage";

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
    setBusy(true);
    setError("");
    const users = loadUsers();
    const key = name.toLowerCase();
    const hash = await hashPass(passcode);

    if (mode === "signup") {
      if (users[key]) {
        setError("That name is already taken — try signing in instead.");
        setBusy(false);
        return;
      }
      users[key] = { name, passHash: hash, createdAt: Date.now() };
      saveUsers(users);
      if (Object.keys(users).length === 1) {
        const legacy = localStorage.getItem("civics-progress");
        if (legacy) localStorage.setItem("civics-progress-" + key, legacy);
      }
      onLogin(key, name);
    } else {
      const u = users[key];
      if (!u || u.passHash !== hash) {
        setError("Wrong name or passcode.");
        setBusy(false);
        return;
      }
      onLogin(key, u.name);
    }
    setBusy(false);
  };

  return (
    <div className="card login-card">
      <h2 className="q-text">
        {mode === "signup" ? "Create your profile" : "Welcome back"}
      </h2>
      <p className="login-note">
        Each person practicing on this device gets their own name and
        passcode, so everyone's completed units are tracked separately. This
        stays on this device/browser only.
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
