import { Edit } from "lucide-react";
import React, { useState, useMemo } from "react";
import EditProfile from "./EditProfile";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import Activities from "./ActivityProfile";
import ActivityProfile from "./ActivityProfile";

export default function ProfileDisplay( {user, isOwner}) {
  const [tab, setTab] = useState("Settings");
  const [imageList, setImageList] = useState([]);
  const quillFormats = useMemo(
      () => [
        "header",
        "bold",
        "italic",
        "underline",
        "list",
        "bullet",
        "link",
        "image",
        "code-block",
        "table",
      ],
      []
    );
  const handleTabChange = (tab) => {
    setTab(tab);
  };
  return (
    <div className="max-w-4xl mx-auto mt-3">
      <div>
        <div className="flex items-center">
          <img src={user.profileImage} alt="avatar" className="w-20 h-20" />
          <div className="ml-4">
            <h2 className="text-2xl font-bold">{user.displayName}</h2>
          </div>
        </div>
      </div>
      <div>
        <ul className="flex gap-1 mt-4">
          <li
            className={`px-3 py-1 cursor-pointer ${
              tab === "Activity" ? "bg-orange-500 text-white rounded-3xl" : ""
            }`}
            onClick={() => handleTabChange("Activity")}
          >
            Activity
          </li>
          <li
            className={`px-3 py-1 cursor-pointer ${
              tab === "Settings" ? "bg-orange-500 text-white rounded-3xl" : ""
            }`}
            onClick={() => handleTabChange("Settings")}
          >
            Settings
          </li>
        </ul>
      </div>
      {tab === "Settings" && (
        <EditProfile user={user} isOwner={isOwner} />
      )}
      {tab  === "Activity" && (
        <ActivityProfile />
      )}
    </div>
  );
}
