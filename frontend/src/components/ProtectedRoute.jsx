import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
  const [IsAuthorised, SetIsAuthorise] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
          SetIsAuthorise(false);
          return;
        }

        const decoded = jwtDecode(token);
        const tokenExperation = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExperation > now) {
          SetIsAuthorise(true);
        } else {
          const refresh = localStorage.getItem(REFRESH_TOKEN);
          const res = await api.post("/api/token/refresh/", { refresh });
          if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            SetIsAuthorise(true);
          } else {
            SetIsAuthorise(false);
          }
        }
      } catch (error) {
        console.log(error);
        SetIsAuthorise(false);
      }
    };

    checkAuth();
  }, []);

  if (IsAuthorised === null) {
    return <div>Loading...</div>;
  }

  return IsAuthorised ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
