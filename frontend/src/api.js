import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

let token = localStorage.getItem("token") || "";

const api = axios.create({
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${token}` },
});

const setAuthToken = (t) => {
  token = t;
  api.defaults.headers.Authorization = `Bearer ${token}`;
};

export { setAuthToken };
export default api;
