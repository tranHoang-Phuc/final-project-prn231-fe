import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import axios from "axios";
import { BaseUrl } from "../configurations/config";

export default function Header() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const accessToken = getToken();

  useEffect(() => {
    if (!accessToken && !isLogin) {
      navigate("/login");
    }
  }, [accessToken, navigate, isLogin]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex justify-center py-[10px] relative">
        <div className="mr-7">
          <img
            src="https://res.cloudinary.com/dbrm5eowo/image/upload/v1740481493/logo_tw2wjj.png"
            alt="logo"
            className="h-10 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div ref={searchRef} className="relative">
          <div className="w-full max-w-sm min-w-[700px]">
            <div className="relative flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>

              <input
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Search..."
                onFocus={() => setShowPopup(true)}
              />
              {!accessToken && !isLogin && (
                <button
                  className="rounded-md bg-blue-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-400 focus:shadow-none active:bg-blue-400 hover:bg-blue-400 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {showPopup && (
            <div className="absolute top-full left-0 mt-2 w-[618px] bg-white border border-gray-300 shadow-lg rounded-md p-4 z-50">
              <div className="absolute -top-[9px] left-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-300"></div>
              <p className="text-gray-500 text-sm mb-2">Search tips:</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>
                  <p>
                    <span className="font-medium">[tag]</span> search within a
                    tag
                  </p>
                  <p>
                    <span className="font-medium">user:alias-name</span> search
                    by author
                  </p>
                  <p>
                    <span className="font-medium">"words here"</span> extract
                    phrase
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">answers:0</span> unanswered
                    questions
                  </p>
                  <p>
                    <span className="font-medium">score:3</span> posts with a 3+
                    score
                  </p>
                  <p>
                    <span className="font-medium">isaccepted:yes</span> search
                    within status
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 border-t pt-3">
                <button onClick={() => navigate("/question/ask")} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                  Ask question
                </button>
                <a href="#" className="text-blue-500 text-sm hover:underline">
                  Search help
                </a>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}