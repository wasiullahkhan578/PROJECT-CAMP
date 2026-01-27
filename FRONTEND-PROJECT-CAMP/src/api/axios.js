import axios from "axios";

const api = axios.create({
  // Agar environment variable hai toh wo use karega, nahi toh localhost (Safe for both)
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

export default api;
