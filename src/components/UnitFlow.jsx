import { useEffect, useState } from "react";
import { UNITS } from "../lib/units";
import { shuffle } from "../lib/shuffle";
import { stopSpeaking } from "../lib/speech";
import { LearnCard } from "./LearnCard";
import { Quiz } from "./Quiz";
import { QuestionView } from "./QuestionView";

export function UnitFlow({ unitIdx, mic, completedQs, onComplete, onQuestionDone, onExit }) {
  const all = UNITS[unitIdx];
  const [stage, setStage] = useState("overview"); // overview | learn | quiz | review | relearn
  const [list, setList] = useState(all); // current learning list
  const [pos, setPos] = useState(0);
  const [maxPos, setMaxPos] = useState(0); // frontier: first not-yet-answered question
  const [lastResults, setLastResults] = useState(null);
  const [viewQ, setViewQ] = useState(null); // question being viewed read-only
  const [practiceQ, setPracticeQ] = useState(null); // question being drilled standalone
  const [quizQs, setQuizQs] = useState(all); // questions in the active quiz attempt

  // Cancel any speech from the view being left before the next one mounts
  // (the cleanup runs before the new stage's effects, so it never clips the
  // new view's own speak() call).
  useEffect(() => {
    return () => stopSpeaking();
  }, [stage, viewQ, practiceQ]);

  const firstIncompleteIdx = all.findIndex(
    (q) => !completedQs.includes(q.n),
  );
  const allDone = firstIncompleteIdx === -1;
  const someDone = all.some((q) => completedQs.includes(q.n));

  // Always rebuild the quiz from whatever isn't mastered yet (freshly
  // shuffled), so leaving and re-entering the quiz never re-asks questions
  // already answered correctly. If everything's already mastered (a
  // deliberate retake), quiz the whole unit again.
  const enterQuiz = () => {
    const remaining = all.filter((q) => !completedQs.includes(q.n));
    setQuizQs(shuffle(remaining.length ? remaining : all));
    setViewQ(null);
    setStage("quiz");
  };

  const startLearning = () => {
    setViewQ(null);
    if (allDone) {
      enterQuiz();
    } else {
      setList(all);
      setPos(firstIncompleteIdx);
      setMaxPos(firstIncompleteIdx);
      setStage("learn");
    }
  };

  const mastered = () => {
    if (pos === maxPos) {
      // answered the frontier question
      if (pos + 1 < list.length) {
        setMaxPos(maxPos + 1);
        setPos(pos + 1);
      } else enterQuiz();
    } else {
      // retried an already-answered one
      setPos(pos + 1);
    }
  };
  const quizDone = (results) => {
    const wrong = results.filter((r) => !r.correct).map((r) => r.q);
    setLastResults(results);
    if (wrong.length === 0) {
      onComplete();
    } else {
      setList(wrong);
      setPos(0);
      setMaxPos(0);
      setStage("review");
    }
  };

  return (
    <div>
      <div className="topbar">
        <button className="ghost small" onClick={onExit}>
          ← Units
        </button>
        <span className="unit-label">
          Unit {unitIdx + 1} · Questions {all[0].n}–{all[all.length - 1].n}
        </span>
        {stage === "overview" && (
          <span className="unit-stage">
            {viewQ
              ? "Reviewing Q" + viewQ.n
              : practiceQ
                ? "Practicing Q" + practiceQ.n
                : "Unit overview"}
          </span>
        )}
        {stage === "learn" && (
          <span className="unit-stage">
            Learning {pos + 1}/{list.length}
          </span>
        )}
        {stage === "relearn" && (
          <span className="unit-stage">
            Reviewing {pos + 1}/{list.length}
          </span>
        )}
        {stage === "quiz" && <span className="unit-stage">Unit quiz</span>}
      </div>

      {stage === "overview" && viewQ && (
        <QuestionView
          q={viewQ}
          mastered={completedQs.includes(viewQ.n)}
          onBack={() => setViewQ(null)}
        />
      )}

      {stage === "overview" && !viewQ && practiceQ && (
        <div>
          <button
            className="ghost small"
            onClick={() => setPracticeQ(null)}
          >
            ← Back to unit questions
          </button>
          <LearnCard
            key={practiceQ.n}
            q={practiceQ}
            mic={mic}
            onMastered={() => setPracticeQ(null)}
          />
        </div>
      )}

      {stage === "overview" && !viewQ && !practiceQ && (
        <div className="card">
          <h2 className="q-text">Unit {unitIdx + 1} questions</h2>
          <p className="step-label">
            Tap any question below to preview it — no practicing required.
            Mastered ones are marked ✓. Ready to be tested? Take the unit quiz
            directly, or start guided practice below.
          </p>
          <ul className="q-overview-list">
            {all.map((q) => {
              const isDone = completedQs.includes(q.n);
              return (
                <li
                  key={q.n}
                  className={"q-overview-item" + (isDone ? " done" : "")}
                >
                  <span className="q-overview-num">Q{q.n}</span>
                  <span className="q-overview-text">{q.q}</span>
                  {isDone && <span className="q-overview-check">✓</span>}
                  <button className="ghost small" onClick={() => setViewQ(q)}>
                    View
                  </button>
                  <button
                    className="ghost small"
                    onClick={() => setPracticeQ(q)}
                  >
                    Practice
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="btn-row">
            <button className="primary" onClick={startLearning}>
              {allDone
                ? "Retake unit quiz"
                : someDone
                  ? "Continue unit"
                  : "Start unit"}
            </button>
            {!allDone && (
              <button className="ghost" onClick={enterQuiz}>
                Skip to unit quiz
              </button>
            )}
          </div>
        </div>
      )}

      {(stage === "learn" || stage === "relearn") && (
        <LearnCard
          q={list[pos]}
          mic={mic}
          onPrev={pos > 0 ? () => setPos(pos - 1) : null}
          answered={pos < maxPos}
          onForward={pos < maxPos ? () => setPos(maxPos) : null}
          onMastered={mastered}
        />
      )}

      {stage === "quiz" && (
        <Quiz
          questions={quizQs}
          title={"Unit " + (unitIdx + 1) + " quiz"}
          mic={mic}
          onFinish={quizDone}
          onCorrect={onQuestionDone}
        />
      )}

      {stage === "review" && (
        <div className="card">
          <h2 className="q-text">Almost there</h2>
          <p>
            You got{" "}
            <b>
              {lastResults.filter((r) => r.correct).length} of{" "}
              {lastResults.length}
            </b>
            . You need to get every question right at least once to master
            the unit.
          </p>
          <p>
            Let's re-practice the {list.length} you missed, then retake the
            quiz on just those:
          </p>
          <ul className="miss-list">
            {list.map((q) => (
              <li key={q.n}>
                Q{q.n}: {q.q}
              </li>
            ))}
          </ul>
          <button className="primary" onClick={() => setStage("relearn")}>
            Practice missed questions
          </button>
        </div>
      )}
    </div>
  );
}
