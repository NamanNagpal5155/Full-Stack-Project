import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, saveSession } from "../api";

export default function Auth({ mode }) {
  const navigate = useNavigate();
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Authentication failed.");
      saveSession(data);
      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="kicker">MOODIFY / YOUR LISTENING ROOM</p>
        <h1>{isSignup ? "Make the playlist yours." : "Welcome back to your mood."}</h1>
        <p className="auth-copy">Track the songs that move with you, day after day.</p>
        <form onSubmit={submit}>
          {isSignup && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />}
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" required />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password (6+ characters)" minLength={6} required />
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" disabled={loading}>{loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}</button>
        </form>
        <p className="auth-switch">
          {isSignup ? "Already have an account? " : "New to MOODIFY? "}
          <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create one"}</Link>
        </p>
      </section>
    </main>
  );
}
