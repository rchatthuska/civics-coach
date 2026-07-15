import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./CivicsCoach.css";
import { Q } from "./data/questions";
import { UNITS } from "./lib/units";
import { shuffle } from "./lib/shuffle";
import { speak, stopSpeaking } from "./lib/speech";
import { useMic } from "./hooks/useMic";
import { auth, firebaseReady } from "./lib/firebase";
import { loadProgress, saveProgress } from "./lib/storage";
import { UnitFlow } from "./components/UnitFlow";
import { Quiz } from "./components/Quiz";
import { Login } from "./components/Login";

/* ================= main app ================= */
export default function CivicsCoach() {
  const mic = useMic();
  const [currentUser, setCurrentUser] = useState(null); // {uid, key, name}
  const [authLoaded, setAuthLoaded] = useState(false);
  const [screen, setScreen] = useState("home"); // home | unit | midterm | midtermResult | final | finalResult | practice | practiceResult
  const [unitIdx, setUnitIdx] = useState(0);
  const [done, setDone] = useState([]); // completed unit indexes
  const [completedQs, setCompletedQs] = useState([]); // question numbers answered correctly in a quiz
  const [midterm, setMidterm] = useState({ best: 0, taken: false });
  const [midtermQs, setMidtermQs] = useState([]);
  const [midtermRes, setMidtermRes] = useState(null);
  const [finalInterview, setFinalInterview] = useState({ best: 0, taken: false });
  const [finalQs, setFinalQs] = useState([]);
  const [finalRes, setFinalRes] = useState(null);
  const [practiceQs, setPracticeQs] = useState([]);
  const [practiceRes, setPracticeRes] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Stop any in-progress speech the instant the user navigates away from a
  // screen, or leaves/hides the tab entirely — otherwise a question/answer
  // keeps talking after the page it belongs to is gone.
  useEffect(() => {
    return () => stopSpeaking();
  }, [screen]);

  useEffect(() => {
    const onHide = () => {
      if (document.hidden) stopSpeaking();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", stopSpeaking);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", stopSpeaking);
    };
  }, []);

  useEffect(() => {
    if (!firebaseReady) {
      setAuthLoaded(true);
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const key = user.email.split("@")[0];
        setCurrentUser({ uid: user.uid, key, name: user.displayName || key });
      } else {
        setCurrentUser(null);
      }
      setAuthLoaded(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoaded(true);
      return;
    }
    setLoaded(false);
    loadProgress(currentUser.uid)
      .then((p) => {
        setDone((p && p.done) || []);
        setCompletedQs((p && p.completedQs) || []);
        setMidterm((p && p.midterm) || { best: 0, taken: false });
        setFinalInterview(
          (p && p.finalInterview) || { best: 0, taken: false },
        );
      })
      .catch(() => {
        setDone([]);
        setCompletedQs([]);
        setMidterm({ best: 0, taken: false });
        setFinalInterview({ best: 0, taken: false });
      })
      .finally(() => setLoaded(true));
  }, [currentUser]);

  const save = (d, m, c, f) => {
    if (!currentUser) return;
    saveProgress(currentUser.uid, {
      done: d,
      midterm: m,
      completedQs: c,
      finalInterview: f,
    }).catch(() => {});
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setScreen("home");
    signOut(auth).catch(() => {});
  };

  const markQuestionDone = (q) => {
    setCompletedQs((prev) => {
      if (prev.includes(q.n)) return prev;
      const next = [...prev, q.n];
      save(done, midterm, next, finalInterview);
      return next;
    });
  };
  const completeUnit = () => {
    const d = done.includes(unitIdx) ? done : [...done, unitIdx];
    setDone(d);
    save(d, midterm, completedQs, finalInterview);
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
    save(done, m, completedQs, finalInterview);
    setMidtermRes(results);
    setScreen("midtermResult");
  };

  const startFinal = () => {
    setFinalQs(shuffle(Q).slice(0, 20));
    setFinalRes(null);
    setScreen("final");
  };
  const finalDone = (results) => {
    const score = results.filter((r) => r.correct).length;
    const f = { best: Math.max(finalInterview.best, score), taken: true };
    setFinalInterview(f);
    save(done, midterm, completedQs, f);
    setFinalRes(results);
    setScreen("finalResult");
  };

  const startPractice = () => {
    setPracticeQs(shuffle(Q));
    setPracticeRes(null);
    setScreen("practice");
  };
  const practiceDone = (results) => {
    setPracticeRes(results);
    setScreen("practiceResult");
  };

  const midtermUnlocked = [0, 1, 2, 3, 4, 5].every((i) => done.includes(i));
  const finalUnlocked = UNITS.every((_, i) => done.includes(i));
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
            <button
              className={"unit-card final" + (finalUnlocked ? "" : " locked")}
              disabled={!finalUnlocked}
              onClick={startFinal}
            >
              <span className="unit-n">Final Interview</span>
              <span className="unit-range">20 random of all 128</span>
              <span className="unit-status">
                {finalUnlocked
                  ? finalInterview.taken
                    ? "Best: " + finalInterview.best + "/20 · Retake →"
                    : "Start →"
                  : "🔒 Finish all 13 units"}
              </span>
            </button>
            <button className="unit-card practice" onClick={startPractice}>
              <span className="unit-n">Practice Quiz</span>
              <span className="unit-range">All 128, freshly shuffled</span>
              <span className="unit-status">Start →</span>
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

      {screen === "final" && (
        <div>
          <div className="topbar">
            <button className="ghost small" onClick={() => setScreen("home")}>
              ← Exit final interview
            </button>
          </div>
          <Quiz
            questions={finalQs}
            title="Final Interview"
            mic={mic}
            onFinish={finalDone}
          />
        </div>
      )}

      {screen === "finalResult" && finalRes && (
        <div className="card">
          <h2 className="q-text">Final interview results</h2>
          <div
            className={
              "big-score " +
              (finalRes.filter((r) => r.correct).length >= 12 ? "ok" : "bad")
            }
          >
            {finalRes.filter((r) => r.correct).length} / 20
          </div>
          <p>
            {finalRes.filter((r) => r.correct).length >= 12
              ? "Pass — the real interview stops once you've answered 12 correctly!"
              : "Keep practicing the missed ones below, then retake."}
          </p>
          {finalRes.some((r) => !r.correct) && (
            <ul className="miss-list">
              {finalRes
                .filter((r) => !r.correct)
                .map((r) => (
                  <li key={r.q.n}>
                    Q{r.q.n}: {r.q.q} — <i>{r.q.a[0]}</i>
                  </li>
                ))}
            </ul>
          )}
          <div className="btn-row">
            <button className="primary" onClick={startFinal}>
              Retake final interview
            </button>
            <button className="ghost" onClick={() => setScreen("home")}>
              Back to units
            </button>
          </div>
        </div>
      )}

      {screen === "practice" && (
        <div>
          <div className="topbar">
            <button className="ghost small" onClick={() => setScreen("home")}>
              ← Exit practice quiz
            </button>
          </div>
          <Quiz
            questions={practiceQs}
            title="Practice Quiz"
            mic={mic}
            onFinish={practiceDone}
          />
        </div>
      )}

      {screen === "practiceResult" && practiceRes && (
        <div className="card">
          <h2 className="q-text">Practice quiz results</h2>
          <div
            className={
              "big-score " +
              (practiceRes.filter((r) => r.correct).length >= 100
                ? "ok"
                : "bad")
            }
          >
            {practiceRes.filter((r) => r.correct).length} / {practiceRes.length}
          </div>
          <p>
            {practiceRes.some((r) => !r.correct)
              ? "Review the missed ones below, then try again — the order is reshuffled every time."
              : "All 128, correct! Take it again anytime — the order reshuffles each attempt."}
          </p>
          {practiceRes.some((r) => !r.correct) && (
            <ul className="miss-list">
              {practiceRes
                .filter((r) => !r.correct)
                .map((r) => (
                  <li key={r.q.n}>
                    Q{r.q.n}: {r.q.q} — <i>{r.q.a[0]}</i>
                  </li>
                ))}
            </ul>
          )}
          <div className="btn-row">
            <button className="primary" onClick={startPractice}>
              Retake practice quiz
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
