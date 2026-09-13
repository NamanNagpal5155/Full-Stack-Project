import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { motion as Motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { API_URL, getToken, getUser } from "../api";

export default function FacialExpression() {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [expression, setExpression] = useState("Not detected");
  const [selectedMood, setSelectedMood] = useState("");
  const [songs, setSongs] = useState([]);

  const url = `${API_URL}/app/songs`;
  useEffect(() => {
    async function loadSongs() {
      try {
        const response = await fetch(url);
        const data1 = await response.json();
        setSongs(Array.isArray(data1.all) ? data1.all : []);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
        setSongs([]);
      }
    }

    loadSongs();
  }, [url]);

  useEffect(() => {
    if (!getToken() || expression === "Not detected") return;
    fetch(`${API_URL}/analytics/moods`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ mood: expression })
    }).catch(() => {});
  }, [expression]);

  console.log(songs)

  const activeMood = selectedMood || expression;
  const filterSongs = songs.filter((el) =>
    activeMood === "Not detected" || !activeMood || el.mood === activeMood
  );

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
      startVideo();
    };
    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
      });
    };
    loadModels();
  }, []);

  const handleClick = async () => {
    if (!modelsLoaded) return;
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
    if (detection) {
      const sorted = Object.entries(detection.expressions).sort(
        (a, b) => b[1] - a[1]
      );
      setExpression(sorted[0][0]);
    }
  };

  // ---- SINGLE audio element ke liye ----
  const audioRef = useRef(null);
  const [currentId, setCurrentId] = useState(null); // kaunsa song load hai
  const [isPlaying, setIsPlaying] = useState(false); // audio events se sync

  const handlePlay = (song) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentId === song._id) {
      // same song → toggle
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    } else {
      // dusra song → src switch phir play
      audio.src = song.audioFile;
      setCurrentId(song._id);
      audio.play().catch(() => {});
      if (getToken()) {
        fetch(`${API_URL}/analytics/plays`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ title: song.title, artist: song.artist, mood: song.mood })
        }).catch(() => {});
      }
    }
  };

  return (
    <div className="player-page">
      <Motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="player-header"
      >
          <span>🎧 MOODIFY Player</span>
          <nav className="player-nav">
            {getUser() ? <a href="/dashboard">Dashboard</a> : <a href="/login">Log in</a>}
          </nav>
      </Motion.header>

      <div className="player-hero">
        <Motion.video
          ref={videoRef}
          autoPlay
          muted
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="player-video"
        />

        <Motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="player-intro"
        >
          <h2>Live Mood Detection</h2>
          <p>
            Your current mood is being analyzed in real-time. Enjoy music
            tailored to your feelings.
          </p>

          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="primary-button player-action"
          >
            Start Listening
          </Motion.button>

          <p className="player-mood">
            <span>{selectedMood ? "Selected Mood:" : "Detected Mood:"}</span> {activeMood}
          </p>
        </Motion.div>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="player-library"
      >
        <h3>Recommended Tracks</h3>

        <div className="mood-picker">
          <label htmlFor="mood-filter">Choose a mood</label>
          <select
            id="mood-filter"
            value={selectedMood}
            onChange={(event) => setSelectedMood(event.target.value)}
          >
            <option value="">Show all moods</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="angry">Angry</option>
            <option value="neutral">Neutral</option>
          </select>
          {selectedMood && (
            <button type="button" onClick={() => setSelectedMood("")}>Clear</button>
          )}
        </div>

        {filterSongs.length === 0 ? (
          <p className="player-empty">
            No songs uploaded yet. Add your licensed original-singer tracks at
            <a href="/wp-admin">/wp-admin</a>.
          </p>
        ) : (
          <div className="space-y-3">
          {filterSongs.map((song) => {
            const playingThis = currentId === song._id && isPlaying;
            return (
              <Motion.div
                key={song._id}
                whileHover={{ scale: 1.02 }}
                className="player-track"
              >
                <div>
                  <p className="track-title">{song.title}</p>
                  <p className="track-artist">{song.artist}</p>
                </div>

                <Motion.button
                  onClick={() => handlePlay(song)}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className="play-button"
                >
                  {playingThis ? <Pause size={28} /> : <Play size={28} />}
                </Motion.button>
              </Motion.div>
            );
          })}
          </div>
        )}
      </Motion.div>

      {/* Ek hi audio — loop ke BAHAR */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}