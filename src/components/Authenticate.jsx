import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { setToken, setUser } from "../services/localStorageService";
import { BaseUrl } from "../configurations/config";

export default function Authenticate() {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    const authenCode = new URLSearchParams(window.location.search).get("code");
    console.log(authenCode);
    if (authenCode) {
      axios.post(`${BaseUrl.uri}/auth/login`, { token: authenCode })
        .then((response) => {
          if (response.status === 200) {
            var introspectResponse = response.data;
          setToken(introspectResponse.data.accessToken);
          setIsLoggedin(true);
          axios
          .get(`${BaseUrl.uri}/profile`,{
            headers: {
              Authorization: `Bearer ${introspectResponse.data.accessToken}`,
            },
          }).then((response) => {
            setUser(response.data.data);
          });
            
          }
        }
        ).catch((error) => {
        });
    }
  }, []); 
  useEffect(() => {
    if (isLoggedin) {
      navigate("/");
    }
  }, [isLoggedin, navigate]);

  return null;
}
