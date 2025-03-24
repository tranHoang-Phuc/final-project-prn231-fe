import { useEffect, useState, useMemo, React, useRef } from "react";
import MenuNavigate from "../components/MenuNavigate";
import { useLocation, useNavigate, useParams } from "react-router";
import { getToken } from "../services/localStorageService";
import axios from "axios";
import { BaseUrl } from "../configurations/config";
import ReactQuill from "react-quill";
import { toast, ToastContainer } from "react-toastify";
export default function EditAnswer() {
  const token = getToken();
  const { questionId, id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const quillRef = useRef(null);
  const [details, setDetails] = useState("");
  const [imageList, setImageList] = useState([]);
  const [statusEditor, setStatusEditor] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1)); // Bỏ dấu #
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);
  useEffect(() => {
    axios
      .get(`${BaseUrl.uri}/question/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setQuestion(response.data.data);
        setAnswer(
          response.data.data.answers.find((answer) => answer.id === id)
        );
        setDetails(
          response.data.data.answers.find((answer) => answer.id === id).content
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const converDate = (date) => {
    const beforeFormat = new Date(date);
    const formattedDate =
      beforeFormat.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }) +
      " - " +
      beforeFormat.toLocaleDateString("vi-VN");
    return formattedDate.toString("HH:mm - dd/MM/yyyy");
  };

  const isOwner = (userId) => {
    return question.userId === JSON.parse(localStorage.getItem("user")).id;
  };

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
      axios
        .delete(`${BaseUrl.uri}/image`, {
          data: { url: imageSrc },
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((error) => {
          if (error.response.status === 401) {
            navigate("/login");
          }
        });
    }
    setImageList(newImages);
    setDetails(content);
  };
  const updateAnswer = () => {
    axios
      .put(
        `${BaseUrl.uri}/question/${questionId}/answers/${id}`,
        {
          content: details,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success("Update answer successfully");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/login");
        }
      });
  };

  return (
    <div>
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
      <MenuNavigate />
      {question && (
        <div>
          <div className="max-w-4xl mx-auto my-5 border-b border-gray-300  bg-white p-5">
            <div className="flex justify-between items-center">
              <div className="text-2xl w-3/5 text-wrap cursor-pointer"
               onClick={() => navigate(`/questions/detail/${question.id}`)}
              >{question.title}</div>
            </div>
            <div>
              <ul className="flex gap-4 mt-4">
                <li>
                  <span className="text-gray-500">Created:</span>{" "}
                  {converDate(question.createdAt)}
                </li>
                <li>
                  <span className="text-gray-500">Updated:</span>{" "}
                  {converDate(question.updatedAt)}
                </li>
                <li>
                  <span className="text-gray-500">Views:</span> {question.views}
                </li>
              </ul>
            </div>
          </div>
          <div className="max-w-4xl mx-auto border-b border-gray-300 bg-white p-5">
            <div className="w-full">
              <div className="ml-5 question-content w-fit">
                <div
                  dangerouslySetInnerHTML={{ __html: question.detailProblem }}
                ></div>
                <div
                  dangerouslySetInnerHTML={{ __html: question.expecting }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="ml-5">
                  <ul className="flex gap-4 mt-4 ">
                    {question.questionTags.map((tag, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          navigate(`/questions/tagged/${tag.tagName}`)
                        }
                        className="bg-gray-200 px-3 py-1 rounded-md font-semibold cursor-pointer"
                      >
                        {tag.tagName}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center mr-4 mt-4">
                  <img
                    src={question.createdUser.profileImage}
                    alt="avatar"
                    className="w-6 h-6 rounded-full"
                  />
                  <span
                    className="ml-2 text-blue-600 text-thin
                          cursor-pointer"
                    onClick={
                      isOwner(question.createdUser.id)
                        ? () => navigate("/profile")
                        : () =>
                            navigate(
                              `/profile/${question.createdUser.aliasName}`
                            )
                    }
                  >
                    {question.createdUser.displayName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {answer && (
        <>
          <div className="max-w-4xl mx-auto  bg-white p-5">
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
          </div>
          <div className=" flex justify-center">
            <button
              onClick={updateAnswer}
              className="mt-10 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 hover:opacity-90"
            >
              Update Your Answer
            </button>
          </div>
        </>
      )}
    </div>
  );
}
