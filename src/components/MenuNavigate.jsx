import React from "react";
import { Home, List, Bookmark, Users, Building, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Home", icon: <Home size={20} />, link: "/" },
  // { name: "Questions", icon: <List size={20} />, link: "/questions" },
  { name: "Tags", icon: <Bookmark size={20} />, link: "/tags" },
  { name: "Users", icon: <Users size={20} />, link: "/users" },
];

export default function MenuNavigate() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="w-64 h-[calc(100vh-4rem)] bg-white text-gray-900 p-4 border-r border-gray-300 fixed top-16 left-0 overflow-y-auto">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <a
              onClick={() => navigate(item.link)}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition cursor-pointer ${item.link === location.pathname ? 'bg-gray-200' : ''}`}
              >
              {item.icon}
              <span>{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
