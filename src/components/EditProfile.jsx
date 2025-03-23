import React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { getToken, setUser } from "../services/localStorageService";
import { BaseUrl } from "../configurations/config";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function EditProfile({ user, isOwner }) {
  const navigate = useNavigate();
  const token = getToken();
  const quillRef = useRef(null);
  const [imageList, setImageList] = useState([]);
  const [statusEditor, setStatusEditor] = useState(true);
  const [details, setDetails] = useState(user.aboutMe || "");
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [location, setLocation] = useState(user.location || "");
  const [title, setTitle] = useState(user.title || "");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);


  const getImagesFromHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const imgs = tempDiv.getElementsByTagName("img");
    return Array.from(imgs).map((img) => img.src);
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Invalid image type", {
        position: "bottom-left",
        successClassName: "toast-error",
        autoClose: 5000,
      });
      return;
    }
    setFile(file);
  };
  const uploadImage = async (file, order) => {
    var formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${BaseUrl.uri}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data.url) {
        insertToEditor(response.data.data.url, order);
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
    }
  };
  useEffect(() => {
    const editor = document.querySelectorAll(".ql-editor")[0];
    const handlePaste = (event) => {
      const clipboardData = event.clipboardData || window.clipboardData;
      if (clipboardData) {
        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              uploadImage(file);
              event.preventDefault();
            }
          }
        }
      }
    };
    if (editor) {
      editor.addEventListener("paste", handlePaste);
      return () => {
        editor.removeEventListener("paste", handlePaste);
      };
    }
  }, []);
  const insertToEditor = (imageUrl) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      quill.insertEmbed(range.index, "image", imageUrl);
    }
  };
  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "code-block", "table"],
      ],
    }),
    []
  );
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
  const handleChange = (content) => {
    if (content === "<p><br></p>" && !statusEditor) {
      return;
    }
    const newImages = getImagesFromHTML(content);
    const deletedImages = imageList.filter((img) => !newImages.includes(img));
    if (deletedImages.length > 0) {
      var imageSrc = deletedImages[0];
      axios.delete(`${BaseUrl.uri}/image`, {
        data: { url: imageSrc },
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setImageList(newImages);
    setDetails(content);
  };
  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        `${BaseUrl.uri}/profile`,
        {
          displayName,
          location,
          title,
          aboutMe: details,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.data) {
        setUser(response.data.data);
        toast.success(
          "Update succesfully",
          {
            position: "bottom-left",
            successClassName: "toast-success",
            autoClose: 5000,
          },
          { autoClose: 5000 }
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
    }
  };

  const handleImageSaveChange = () => {
    if (file) {
      var formData = new FormData();
      formData.append("image", file);

      try {
        axios
          .put(`${BaseUrl.uri}/profile/image`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data && response.data.data) {
              setUser(response.data.data);
              toast.success("Update succesfully", {
                position: "bottom-left",successClassName: "toast-success",
                autoClose: 5000,
              });
              setIsPopupOpen(false);
            }
          });
      } catch (error) {
        toast.error("Error when uploading image", {
          position: "bottom-left",
          successClassName: "toast-error",
          autoClose: 5000,
        });
      }
    }
  };
  return (
    <div className="mt-3 mx-auto bg-white p-6 border-t-gray-300 border-t-[1px]">
      <h2 className="text-xl font-semibold mb-4">Public information</h2>

      {/* Profile Image */}
      {isOwner && (

<div className="mb-4">
<p className="font-medium">Profile image</p>
<div className="flex flex-col items-center mt-2">
  <img
    src={user.profileImage} // Thay ảnh profile tại đây
    alt="Profile"
    className="w-24 h-24 rounded-lg border border-gray-300"
  />
  <input type="file" className="mt-2" hidden="true" id="imageProfile" />
  <button
    className="mt-2 bg-gray-700 text-white px-3 py-1 text-sm rounded-md hover:bg-gray-800"
    onClick={() => setIsPopupOpen(true)}
    {...(isOwner ? {} : { hidden: true })}
    >
    Change picture
  </button>
</div>
</div>
      )}
      {isPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md w-96">
            <h3 className="text-lg font-semibold mb-2">Select a new picture</h3>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} />
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                onClick={handleImageSaveChange}
                {...(isOwner ? {} : { disabled: true })}
              >
                Change
              </button>
              <button
                className="mr-2 px-3 py-1 bg-gray-500 text-white rounded-md"
                onClick={() => setIsPopupOpen(false)}
                {...(isOwner ? {} : { disabled: true })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mb-4">
        <label className="block  font-medium">Display name</label>
        <input
          type="text"
          className="w-3/5 border border-gray-500 rounded-md p-2 mt-1  "
          value={displayName} // Thay tên hiển thị tại đây
          onChange={(e) => setDisplayName(e.target.value)}
          {...(isOwner ? {} : { disabled: true })}
        />
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block  font-medium">Location</label>
        <input
          type="text"
          className="w-3/5 border-gray-500 border rounded-md p-2 mt-1 "
          value={location} // Thay địa chỉ tại đây
          onChange={(e) => setLocation(e.target.value)}
          {...(isOwner ? {} : { disabled: true })}
        />
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block  border-gray-500 font-medium">Title</label>
        <input
          type="text"
          className="w-3/5  border border-gray-500 rounded-md p-2 mt-1 "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="No title has been set"
          {...(isOwner ? {} : { disabled: true })}
        />
      </div>

      {/* About Me */}
      <div>
        <label className="block text-gray-700 font-medium">About me</label>
        <ReactQuill
          ref={quillRef}
          placeholder="About me"
          theme="snow"
          value={details}
          onChange={handleChange}
          modules={quillModules}
          formats={quillFormats}
          className={!isOwner ? "bg-white p-2 h-64 mb-10" : "bg-white p-2 h-64"}
          readOnly={!isOwner} 
          />
        <button
          className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:opacity-90 mt-12"
          onClick={handleSaveProfile}
          {...(isOwner ? {} : { hidden: true })}
        >
          Save profile
        </button>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
