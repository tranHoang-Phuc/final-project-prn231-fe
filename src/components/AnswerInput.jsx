import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMemo, useRef, useState, useEffect} from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BaseUrl } from "../configurations/config";
import { getToken } from "../services/localStorageService";
import { useNavigate } from "react-router-dom";


export default function AnswerInput({setNewAnswer, questionId}) {
  const token = getToken();
  const quillRef = useRef(null); 
  const [details, setDetails] = useState("");
  const [imageList, setImageList] = useState([]);
  const [statusEditor, setStatusEditor] = useState(true);
  const navigate = useNavigate()
  
  const getImagesFromHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const imgs = tempDiv.getElementsByTagName("img");
    return Array.from(imgs).map((img) => img.src);
  };

  const uploadImage = async (file, order) => {
    var formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await axios.post(`${BaseUrl.uri}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
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
    if (content=== "<p><br></p>" && !statusEditor){
        return;
    }
    const newImages = getImagesFromHTML(content);
    const deletedImages = imageList.filter((img) => !newImages.includes(img));
    if (deletedImages.length > 0) {
      var imageSrc = deletedImages[0];
      axios.delete(`${BaseUrl.uri}/image`, {
        data: {url : imageSrc},
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setImageList(newImages);
    setDetails(content);
  };

  const postAnswer = () => {
    const content = quillRef.current.getEditor().root.innerHTML;
    if (content.length < 50) {
      toast("Your answer is too short. At least 50 characters", {
        type: "error", autoClose:3000
      });
      return;
    }
    axios
      .post(`${BaseUrl.uri}/question/${questionId}/answers`, { content }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setNewAnswer(response.data.data);
        setTimeout(() => setStatusEditor(false), 0);
        toast("Your answer has been posted", {
          type: "success",
        });
        navigate(`/questions/detail/${questionId}`);
      })

  };
  return (
    <>
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
      <div className="max-w-4xl mx-auto bg-white p-5">
        <div className="mb-5">
          <h2 className="text-2xl font-normal">Your Answer</h2>
          <p className="text-gray-600">
            Answer the question below. Your answer will be public.
          </p>
        </div>
        <div>
          <ReactQuill
            ref={quillRef}
            placeholder="Explane your solution here... At least 50 characters"
            theme="snow"
            value={details}
            onChange={handleChange}
            modules={quillModules}
            formats={quillFormats}
            className="bg-white p-2 h-64"
          />
          <div className="flex justify-end mt-10">
            <button onClick={postAnswer} className="bg-blue-500 text-white px-5 py-2 rounded-lg mt-3 hover:bg-blue-600 hover:opacity-90">
              Post Your Answer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
