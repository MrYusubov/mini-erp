import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {}
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
