import { useEffect, useState } from "react";
import "./CivicsCoach.css";
import { Q } from "./data/questions";
import { UNITS } from "./lib/units";
import { shuffle } from "./lib/shuffle";
import { speak } from "./lib/speech";
import { useMic } from "./hooks/useMic";
import { UnitFlow } from "./components/UnitFlow";
import { Quiz } from "./components/Quiz";
import { Login } from "./components/Login";

/* ================= main app ================= */
export default function CivicsCoach() {
  const mic = useMic();
  const [currentUser, setCurrentUser] = useState(null); // {key, name}
  const [authLoaded, setAuthLoaded] = useState(false);
  const [screen, setScreen] = useState("home"); // home | unit | midterm | midtermResult
  const [unitIdx, setUnitIdx] = useState(0);
  const [done, setDone] = useState([]); // completed unit indexes
  const [completedQs, setCompletedQs] = useState([]); // question numbers answered correctly in a quiz
  const [midterm, setMidterm] = useState({ best: 0, taken: false });
  const [midtermQs, setMidtermQs] = useState([]);
  const [midtermRes, setMidtermRes] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("civics-current-user");
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (e) {}
    setAuthLoaded(true);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoaded(true);
      return;
    }
    setLoaded(false);
    try {
      const raw = localStorage.getItem(
        "civics-progress-" + currentUser.key,
      );
      if (raw) {
        const p = JSON.parse(raw);
        setDone(p.done || []);
        setCompletedQs(p.completedQs || []);
        setMidterm(p.midterm || { best: 0, taken: false });
      } else {
        setDone([]);
        setCompletedQs([]);
        setMidterm({ best: 0, taken: false });
      }
    } catch (e) {}
    setLoaded(true);
  }, [currentUser]);

  const save = (d, m, c) => {
    if (!currentUser) return;
    try {
      localStorage.setItem(
        "civics-progress-" + currentUser.key,
        JSON.stringify({ done: d, midterm: m, completedQs: c }),
      );
    } catch (e) {}
  };

  const handleLogin = (key, name) => {
    const u = { key, name };
    setCurrentUser(u);
    try {
      localStorage.setItem("civics-current-user", JSON.stringify(u));
    } catch (e) {}
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setScreen("home");
    try {
      localStorage.removeItem("civics-current-user");
    } catch (e) {}
  };

  const markQuestionDone = (q) => {
    setCompletedQs((prev) => {
      if (prev.includes(q.n)) return prev;
      const next = [...prev, q.n];
      save(done, midterm, next);
      return next;
    });
  };
  const completeUnit = () => {
    const d = done.includes(unitIdx) ? done : [...done, unitIdx];
    setDone(d);
    save(d, midterm, completedQs);
    setScreen("home");
    speak("Congratulations! Unit " + (unitIdx + 1) + " complete.");
  };
  const startMidterm = () => {
    setMidtermQs(shuffle(Q.slice(0, 60)).slice(0, 30));
    setMidtermRes(null);
    setScreen("midterm");
  };
  const midtermDone = (results) => {
    const score = results.filter((r) => r.correct).length;
    const m = { best: Math.max(midterm.best, score), taken: true };
    setMidterm(m);
    save(done, m, completedQs);
    setMidtermRes(results);
    setScreen("midtermResult");
  };

  const midtermUnlocked = [0, 1, 2, 3, 4, 5].every((i) => done.includes(i));
  const totalDoneQs = completedQs.length;

  if (!authLoaded) return <div className="app" />;

  if (!currentUser)
    return (
      <div className="app">
        <header className="hero">
          <div className="seal">★</div>
          <h1>Civics Coach</h1>
          <p className="tagline">
            2025 USCIS Naturalization Test · 128 questions · listen, repeat
            ×3, answer
          </p>
        </header>
        <Login onLogin={handleLogin} />
      </div>
    );

  if (!loaded)
    return (
      <div className="app">
        <div className="card">Loading your progress…</div>
      </div>
    );

  return (
    <div className="app">
      {screen === "home" && (
        <>
          <header className="hero">
            <div className="seal">★</div>
            <h1>Civics Coach</h1>
            <p className="tagline">
              2025 USCIS Naturalization Test · 128 questions · listen, repeat
              ×3, answer
            </p>
            <div className="user-bar">
              <span>Signed in as {currentUser.name}</span>
              <button className="ghost small" onClick={handleLogout}>
                Switch profile
              </button>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: (totalDoneQs / 128) * 100 + "%" }}
              />
            </div>
            <p className="progress-txt">
              {totalDoneQs} of 128 questions mastered
            </p>
          </header>

          <div className="unit-grid">
            {UNITS.map((u, i) => {
              const locked =
                i > 0 && !done.includes(i - 1) && !done.includes(i);
              const isDone = done.includes(i);
              const unitMastered = u.filter((q) =>
                completedQs.includes(q.n),
              ).length;
              return (
                <button
                  key={i}
                  disabled={locked}
                  className={
                    "unit-card" +
                    (isDone ? " done" : "") +
                    (locked ? " locked" : "")
                  }
                  onClick={() => {
                    setUnitIdx(i);
                    setScreen("unit");
                  }}
                >
                  <span className="unit-n">Unit {i + 1}</span>
                  <span className="unit-range">
                    Q{u[0].n}–{u[u.length - 1].n}
                  </span>
                  <span className="unit-status">
                    {isDone
                      ? "✓ Passed"
                      : locked
                        ? "🔒 Locked"
                        : unitMastered > 0
                          ? unitMastered + "/" + u.length + " · Continue →"
                          : "Start →"}
                  </span>
                </button>
              );
            })}
            <button
              className={
                "unit-card midterm" + (midtermUnlocked ? "" : " locked")
              }
              disabled={!midtermUnlocked}
              onClick={startMidterm}
            >
              <span className="unit-n">Midterm</span>
              <span className="unit-range">30 random of Q1–60</span>
              <span className="unit-status">
                {midtermUnlocked
                  ? midterm.taken
                    ? "Best: " + midterm.best + "/30 · Retake →"
                    : "Start →"
                  : "🔒 Finish units 1–6"}
              </span>
            </button>
          </div>
          <p className="footnote">
            Officials' names (President, Speaker, Governor, senators…) change —
            verify at uscis.gov/citizenship/testupdates before your interview.
            Progress saves automatically.
          </p>
        </>
      )}

      {screen === "unit" && (
        <UnitFlow
          unitIdx={unitIdx}
          mic={mic}
          completedQs={completedQs}
          onComplete={completeUnit}
          onQuestionDone={markQuestionDone}
          onExit={() => setScreen("home")}
        />
      )}

      {screen === "midterm" && (
        <div>
          <div className="topbar">
            <button className="ghost small" onClick={() => setScreen("home")}>
              ← Exit midterm
            </button>
          </div>
          <Quiz
            questions={midtermQs}
            title="Midterm"
            mic={mic}
            onFinish={midtermDone}
          />
        </div>
      )}

      {screen === "midtermResult" && midtermRes && (
        <div className="card">
          <h2 className="q-text">Midterm results</h2>
          <div
            className={
              "big-score " +
              (midtermRes.filter((r) => r.correct).length >= 24 ? "ok" : "bad")
            }
          >
            {midtermRes.filter((r) => r.correct).length} / 30
          </div>
          <p>
            {midtermRes.filter((r) => r.correct).length >= 24
              ? "Strong pass — the real test only needs 12 of 20!"
              : "Keep practicing the missed ones below, then retake."}
          </p>
          {midtermRes.some((r) => !r.correct) && (
            <ul className="miss-list">
              {midtermRes
                .filter((r) => !r.correct)
                .map((r) => (
                  <li key={r.q.n}>
                    Q{r.q.n}: {r.q.q} — <i>{r.q.a[0]}</i>
                  </li>
                ))}
            </ul>
          )}
          <div className="btn-row">
            <button className="primary" onClick={startMidterm}>
              Retake midterm
            </button>
            <button className="ghost" onClick={() => setScreen("home")}>
              Back to units
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
