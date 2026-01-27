import axios from "axios";

// ✅ VITE_BACKEND_URL variable se value uthayega
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
