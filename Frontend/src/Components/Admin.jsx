import { useState, useRef } from "react";
import { API_URL } from "../api";

const MOODS = ["neutral","happy","sad","angry"];

// Change this if your backend runs elsewhere
const ENDPOINT = `${API_URL}/app/song`;

export default function Admin() {
  const [adminPassword, setAdminPassword] = useState("");
  const [artist, setArtist] = useState("");
  const [mood, setMood] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { ok: boolean, msg: string }
  const fileRef = useRef(null);

  const reset = () => {
    setArtist("");
    setMood("");
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    setResult(null);

    if (!artist.trim() || !mood || !files.length) {
      setResult({ ok: false, msg: "Artist, mood, aur kam se kam ek song file choose karo." });
      return;
    }

    // Multipart body — file JSON me nahi jaa sakti, isliye FormData
    const fd = new FormData();
    fd.append("artist", artist.trim());
    fd.append("mood", mood);
    files.forEach((selectedFile) => {
      const title = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();
      fd.append("title", title);
      fd.append("audioFile", selectedFile);
    });

    try {
      setLoading(true);
      // NOTE: koi 'Content-Type' header mat set karo — browser khud
      // multipart boundary laga dega. Manually set kiya to backend break hoga.
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "X-Admin-Password": adminPassword },
        body: fd
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server ${res.status}: ${text || "upload failed"}`);
      }

      setResult({ ok: true, msg: `${files.length} songs upload ho gaye ✅` });
      reset();
    } catch (err) {
      setResult({ ok: false, msg: err.message || "Kuch galat ho gaya." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sf-wrap">
      <style>{`
        .sf-wrap {
          --teal: #0f766e;
          --teal-bright: #14b8a6;
          --ink: #0f172a;
          --muted: #64748b;
          --line: #e2e8f0;
          --bg: #f8fafc;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
          color: var(--ink);
          max-width: 460px;
          margin: 32px auto;
          padding: 0 16px;
        }
        .sf-card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 28px 26px 30px;
          box-shadow: 0 1px 2px rgba(15,23,42,.04), 0 12px 32px -18px rgba(15,118,110,.35);
        }
        .sf-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 600; letter-spacing: .08em;
          text-transform: uppercase; color: var(--teal);
          margin-bottom: 6px;
        }
        .sf-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--teal-bright); }
        .sf-title { font-size: 22px; font-weight: 700; margin: 0 0 22px; letter-spacing: -.01em; }
        .sf-field { margin-bottom: 16px; }
        .sf-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #334155; }
        .sf-input, .sf-select {
          width: 100%; box-sizing: border-box;
          padding: 11px 13px; font-size: 14px;
          border: 1px solid var(--line); border-radius: 10px;
          background: var(--bg); color: var(--ink);
          outline: none; transition: border-color .15s, box-shadow .15s, background .15s;
        }
        .sf-input:focus, .sf-select:focus {
          border-color: var(--teal-bright);
          box-shadow: 0 0 0 3px rgba(20,184,166,.15);
          background: #fff;
        }
        .sf-select { appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center; padding-right: 38px;
        }
        .sf-drop {
          border: 1.5px dashed #cbd5e1; border-radius: 12px;
          padding: 18px; text-align: center; cursor: pointer;
          transition: border-color .15s, background .15s;
          background: var(--bg);
        }
        .sf-drop:hover { border-color: var(--teal-bright); background: #f0fdfa; }
        .sf-drop.has-file { border-color: var(--teal); border-style: solid; background: #f0fdfa; }
        .sf-drop-icon { color: var(--teal); margin-bottom: 6px; }
        .sf-drop-main { font-size: 14px; font-weight: 600; color: #334155; }
        .sf-drop-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .sf-hidden { display: none; }
        .sf-btn {
          width: 100%; margin-top: 8px; padding: 12px;
          font-size: 15px; font-weight: 600; color: #fff;
          background: var(--teal); border: none; border-radius: 10px;
          cursor: pointer; transition: background .15s, transform .05s;
        }
        .sf-btn:hover:not(:disabled) { background: #0d5f58; }
        .sf-btn:active:not(:disabled) { transform: translateY(1px); }
        .sf-btn:disabled { opacity: .6; cursor: not-allowed; }
        .sf-msg { margin-top: 14px; padding: 10px 13px; border-radius: 10px; font-size: 13.5px; font-weight: 500; }
        .sf-msg.ok  { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
        .sf-msg.err { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
      `}</style>

      <div className="sf-card">
        <span className="sf-eyebrow"><span className="sf-dot" /> Upload</span>
        <h2 className="sf-title">Add a song</h2>

        <div className="sf-field">
          <label className="sf-label">Admin password</label>
          <input
            className="sf-input"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter admin password"
            autoComplete="current-password"
          />
        </div>

        <div className="sf-field">
          <label className="sf-label">Artist</label>
          <input
            className="sf-input"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g. Arijit Singh"
          />
        </div>

        <div className="sf-field">
          <label className="sf-label">Mood</label>
          <select className="sf-select" value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="" disabled>Select mood</option>
            {MOODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="sf-field">
          <label className="sf-label">Song files</label>
          <div
            className={`sf-drop${files.length ? " has-file" : ""}`}
            onClick={() => fileRef.current?.click()}
          >
            <div className="sf-drop-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div className="sf-drop-main">
              {files.length ? `${files.length} audio file${files.length > 1 ? "s" : ""} selected` : "Choose audio files"}
            </div>
            <div className="sf-drop-sub">
              {files.length ? "Titles come from filenames" : "Select up to 20 MP3/WAV files"}
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            multiple
            className="sf-hidden"
            onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 20))}
          />
        </div>

        <button className="sf-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Uploading…" : "Upload song"}
        </button>

        {result && (
          <div className={`sf-msg ${result.ok ? "ok" : "err"}`}>{result.msg}</div>
        )}
      </div>
    </div>
  );
}