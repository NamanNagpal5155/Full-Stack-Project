import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, clearSession, getToken, getUser } from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [data, setData] = useState({ recentDays: [], recentPlays: [], mostListened: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { navigate("/login"); return; }
    fetch(`${API_URL}/analytics/summary`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setData(result);
      })
      .catch((requestError) => setError(requestError.message));
  }, [navigate]);

  function logout() { clearSession(); navigate("/login"); }
  const totalPlays = data.recentDays.reduce((sum, day) => sum + day.plays, 0);

  return (
    <main className="dashboard-page">
      <nav className="topbar"><Link className="brand" to="/">MOOD<span>IFY</span></Link><div className="nav-actions"><span>{user?.name}</span><button onClick={logout}>Log out</button></div></nav>
      <section className="dashboard-heading"><div><p className="kicker">YOUR WEEK IN SOUND</p><h1>A little map of your moods.</h1></div><Link className="primary-button compact" to="/">Open player</Link></section>
      {error && <p className="form-error">{error}</p>}
      <section className="stats-grid"><article><span>Plays this week</span><strong>{totalPlays}</strong></article><article><span>Days listened</span><strong>{data.recentDays.filter((day) => day.plays).length}</strong></article><article><span>Top track</span><strong className="stat-song">{data.mostListened[0]?.title || "Nothing yet"}</strong></article></section>
      <section className="dashboard-grid">
        <article className="dashboard-card mood-card"><div className="card-heading"><h2>Recent moods</h2><span>7 days</span></div><div className="mood-list">{data.recentDays.map((day) => <div className="mood-row" key={day.date}><span>{new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" })}</span><div className="mood-bar"><i style={{ width: `${Math.min(100, day.plays * 18 + 8)}%` }} /></div><b>{day.mood}</b></div>)}</div></article>
        <article className="dashboard-card"><div className="card-heading"><h2>Most listened</h2><span>All time</span></div><div className="ranking-list">{data.mostListened.length ? data.mostListened.map((song, index) => <div className="ranking-row" key={`${song.title}-${song.artist}`}><em>0{index + 1}</em><div><b>{song.title}</b><small>{song.artist}</small></div><strong>{song.count}</strong></div>) : <p className="empty-state">Play a song to start building your history.</p>}</div></article>
      </section>
      <section className="dashboard-card recent-card"><div className="card-heading"><h2>Recently played</h2><span>Latest 10</span></div>{data.recentPlays.length ? data.recentPlays.map((song, index) => <div className="recent-row" key={`${song.title}-${song.playedAt}-${index}`}><span>{song.title}</span><small>{song.artist} · {new Date(song.playedAt).toLocaleDateString()}</small></div>) : <p className="empty-state">Your listening history will appear here.</p>}</section>
    </main>
  );
}
