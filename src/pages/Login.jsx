import React, { useEffect } from "react";
import { OauthConfig, BaseUrl } from "../configurations/config";
import {useNavigate} from "react-router-dom";
import { getToken, removeUser } from "../services/localStorageService";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const token = getToken();
  const handleLogin =() => {
    const callBackUrl = OauthConfig.redirectUri;
    const authUrl = OauthConfig.authUri;
    const googleClientId = OauthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(callBackUrl)}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
  }
  
    useEffect(() => {
      if(token) {
        axios.post(`${BaseUrl.uri}/auth/introspect`,{}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
      }).then((response) => {
        if(!response.data.data.isValid) {
          removeUser();
          navigate("/login");
        } else {
          navigate("/");
        }
      }).catch((error) => {
        removeUser();
        
      });
      }
      
    },[])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 -mt-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          <img src="https://cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-icon.svg" alt="Stack Overflow" className="w-10" />
        </div>
        <button onClick={handleLogin}  className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center mb-2 hover:bg-gray-100 hover:opacity-90">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5 mr-2" />
          Log in with Google
        </button>       
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input type="email" className="w-full px-3 py-2 border rounded-md" placeholder="Enter your email" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Password</label>
          <div className="relative">
            <input type="password" className="w-full px-3 py-2 border rounded-md" placeholder="Enter your password" />
            <span className="absolute right-3 top-3 cursor-pointer text-gray-500">👁️</span>
          </div>
          <a href="#" className="text-blue-500 text-sm float-right mt-1">Forgot password?</a>
        </div>
        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md">Log in</button>    
      </div>
    </div>
  );
}
