export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export function getToken() {
  return localStorage.getItem("moodify_token");
}

export function saveSession(data) {
  localStorage.setItem("moodify_token", data.token);
  localStorage.setItem("moodify_user", JSON.stringify(data.user));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("moodify_user")) || null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("moodify_token");
  localStorage.removeItem("moodify_user");
}
