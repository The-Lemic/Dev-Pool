import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
  const [IsAuthorised, SetIsAuthorise] = useState(null);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem(REFRESH_TOKEN, res.data.access);
        SetIsAuthorise(true);
      }
    } catch (error) {
      console.log(error);
      SetIsAuthorise(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      SetIsAuthorise(false);
    }

    const decoded = jwtDecode(token);

    const tokenExperation = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExperation > now) {
      SetIsAuthorise(true);
    } else {
      await refreshToken();
    }

    jwtDecode.IsAuthorised;
  };


    useEffect(() => {
        auth().catch((error) => {
        console.log(error);
        SetIsAuthorise(false);
        });
    }, []);


  if (IsAuthorised === null) {
    return <div>Loading...</div>;
  }

  return IsAuthorised ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
