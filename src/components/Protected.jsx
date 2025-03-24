import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import axios from "axios";
import { BaseUrl } from "../configurations/config";
import Login from "../pages/Login";

export default function Protected({ children }) {
  const navigate = useNavigate();
  const token = getToken();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      axios
        .post(
          `${BaseUrl.uri}/auth/Introspect`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.data.isValid) {
            setIsAuthenticated(true);
          } else {
            navigate("/login");
          }
        })
        .catch(() => navigate("/login"))
        .finally(() => setIsLoading(false));
    }
  }, [token, navigate]);


  return  <Login />;
}
