import { useState } from "react";

export function AnswerInput({ mic, onSubmit, prompt }) {
  const [typed, setTyped] = useState("");
  const submitTyped = () => {
    if (typed.trim()) {
      onSubmit(typed);
      setTyped("");
    }
  };
  const micUsable = mic.supported && !mic.blocked;
  return (
    <div className="answer-box">
      {micUsable && (
        <button
          className={"mic-btn" + (mic.listening ? " live" : "")}
          onClick={() =>
            mic.listening
              ? mic.stop()
              : mic.start((t) => {
                  if (t) onSubmit(t);
                })
          }
        >
          <span className="mic-icon">{mic.listening ? "◉" : "🎙"}</span>
          {mic.listening ? "Listening… tap when done" : prompt}
        </button>
      )}
      {mic.listening && <div className="interim">{mic.interim || "…"}</div>}
      {!micUsable && (
        <div className="mic-note">
          🎙 The microphone is blocked in this preview (the artifact sandbox
          doesn't grant mic access). Say your answer <b>out loud anyway</b> for
          practice, then type it below to check it. Voice input will work when
          you run this app in your own browser or Expo build.
        </div>
      )}
      <div className="typed-row">
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoFocus={!micUsable}
          onKeyDown={(e) => e.key === "Enter" && submitTyped()}
          placeholder={
            micUsable ? "…or type your answer" : "Type your answer here"
          }
        />
        <button className="ghost" onClick={submitTyped}>
          Submit
        </button>
      </div>
    </div>
  );
}
