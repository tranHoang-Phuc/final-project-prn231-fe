import MenuNavigate from '../components/MenuNavigate'
import { BaseUrl } from '../configurations/config';
import { getToken } from '../services/localStorageService';
import axios from "axios";
import { useState, useMemo, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function EditQuestion() {
  const token = getToken();
  const questionId = window.location.pathname.split('/')[3]
  const [question, setQuestion] = useState({});
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [imageList, setImageList] = useState([]);
  const [imageExpectingList, setImageExpectingList] = useState([]);
  const quillRef = useRef(null); 
  const quillRefExpecting = useRef(null);
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
  useEffect(() => {
    axios
      .get(`${BaseUrl.uri}/question/${questionId}`,{headers: {
        Authorization: `Bearer ${token}`
      }})
      .then((res) => {
        const question = res.data.data;
        setQuestion(res.data.data);
        setTitle(question.title);
        setDetails(question.detailProblem);
        setExpectedResult(question.expecting);
        let questionTags = question.questionTags.map((tag) => tag.tagName);
        setTags(questionTags);
      }).catch(() => {
        navigate('/question/detail/' + questionId);
      })
  },[]);


  const getImagesFromHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const imgs = tempDiv.getElementsByTagName("img");
    return Array.from(imgs).map((img) => img.src);
  };
 
  
  const insertToEditor = (imageUrl, order) => {
    
    if (order === 0) {
      if (quillRef.current) {
        const quill = quillRef.current.getEditor(); 
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", imageUrl);
  
      } 
    } else {
      if(quillRefExpecting.current){
        const quill = quillRefExpecting.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", imageUrl);
      }
    }
    
  };
  const handleChange = (content) => {
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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === " " && inputValue.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(inputValue.trim()) && tags.length < 5) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const editor = document.querySelectorAll(".ql-editor")[0];
    const expectingEditor = document.querySelectorAll(".ql-editor")[1];

    const handlePaste = (event, order) => {
        const clipboardData = event.clipboardData || window.clipboardData;
        if (clipboardData) {
          const items = clipboardData.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
              const file = items[i].getAsFile();
              if (file) {
                uploadImage(file, order);
                event.preventDefault();
              }
            }
          }
        }
      };
    if (editor) {
      
      editor.addEventListener("paste",(event) =>  handlePaste(event, 0));
      expectingEditor.addEventListener("paste", (event) =>  handlePaste(event, 1));
      return () => {
        editor.removeEventListener("paste", (event) => handlePaste(event, 0));
        expectingEditor.removeEventListener("paste", (event) => handlePaste(event, 1));
      };
    } else {

    }
  }, []);

  const uploadImage = async (file, order) => {
    var formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await axios.post(`${BaseUrl.uri}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" , Authorization: `Bearer ${token}`},
      });
  
      if (response.data && response.data.data.url) {
        insertToEditor(response.data.data.url, order);
      } 
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
    }
  };

  

  const handleSubmitQuestion = () => {
    if (title === "") {
      toast("Title is required", { type: "error" });
      return;
    }
    if (details === "" || details.length < 20) {
      toast("Details is required and must be at least 20 characters", {
        type: "error",
      });
      return;
    }
    if (expectedResult === "" || expectedResult.length < 20) {
      toast("Expected result is required and must be at least 20 characters", {
        type: "error",
      });
      return;
    }

    axios.put(`${BaseUrl.uri}/question/${questionId}`,
        {
          title: title,
          detailProblem: details,
          expecting: expectedResult,
          tags: tags,
        }
    , {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if(response.status === 200){
        toast("Update question successfully", { type: "success" });  
        navigate("/questions/detail/" + questionId);
      } else {
        toast("Failed to submit question", { type: "error" });
      }
    }).catch(() => {
      toast("Failed to submit question", { type: "error" });
    })
  };


  const handleExpectedResultChange = (content) => {
    const newImages = getImagesFromHTML(content);
    const deletedImages = imageExpectingList.filter((img) => !newImages.includes(img));
    if (deletedImages.length > 0) {
      var imageSrc = deletedImages[0];
      axios.delete(`${BaseUrl.uri}/image`, {
        data: {url : imageSrc},
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setImageExpectingList(newImages);
    setExpectedResult(content);

  }

  return (
    <>
      <MenuNavigate />
      <div className="max-w-4xl mx-auto  bg-white p-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="mr-2">📚</span> Edit question
      </h2>
      

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Title</label>
        <input
          type="text"
          className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200 ml-2"
          placeholder="Be specific and imagine you're asking a question to another person."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          What are the details of your problem?
        </label>
        <ReactQuill
          ref={quillRef}
          placeholder="Introduce the problem and expand on what you put in the title. Minimum 20 characters."
          theme="snow"
          value={details}
          onChange={handleChange}
          modules={quillModules}
          formats={quillFormats}
          className="bg-white p-2 h-64"
        />
      </div>

      <div className="mt-6 p-4 w-full">
        <div
          dangerouslySetInnerHTML={{ __html: details }}
          className="prose max-w-full break-words whitespace-pre-line"
        ></div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          What did you try and what were you expecting?
        </label>
        <ReactQuill
          ref={quillRefExpecting}
          placeholder="Describe what you tried, what you expected to happen, and what actually resulted. Minimum 20 characters."
          theme="snow"
          value={expectedResult}
          onChange={handleExpectedResultChange}
          modules={quillModules}
          formats={quillFormats}
          className="bg-white p-2 h-64"
        />
      </div>

      <div className="mt-6 p-4  w-full">
        <div
          dangerouslySetInnerHTML={{ __html: expectedResult }}
          className="prose max-w-full break-words whitespace-pre-line"
        ></div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Tags</label>
        <div className="w-full border p-2 rounded-lg focus-within:ring focus-within:ring-blue-200 ml-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 px-2  rounded"
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(index)}
                className="ml-2 text-gray-500 hover:text-red-300 font-normal text-sm"
              >
                ✖
              </button>
            </div>
          ))}
          <input
            type="text"
            className="flex-1 outline-none"
            placeholder={
              tags.length === 0
                ? "Add up to 5 tags to describe what your question is about."
                : ""
            }
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={tags.length >= 5}
          />
        </div>
      </div>

      <button
        onClick={handleSubmitQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
      >
        Update question
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </button>
    </div>
    </>
  )
}
