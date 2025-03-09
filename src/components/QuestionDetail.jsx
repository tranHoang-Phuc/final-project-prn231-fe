import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import AnswerDetail from "./AnswerDetail";
import AnswerInput from "./AnswerInput";
import { BaseUrl } from "../configurations/config";
import { getToken } from "../services/localStorageService";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { isBelongTo } from "../services/inbound";
export default function QuestionDetail({
  id,
  title,
  createdAt,
  updatedAt,
  views,
  votes,
  problem,
  expect,
  tags,
  createdUser,
  answers,
}) {
  const [isVoted, setIsVoted] = useState(false);
  const isBelong = isBelongTo(createdUser.id);
  const token = getToken();
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

  const voteQuestion = (questionId, mode) => {
    setIsVoted(isVoted === false ? true : false);
    if (isVoted) {
      axios
      .put(
        `${BaseUrl.uri}/question/${questionId}/${mode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        let element = document.getElementById(questionId);
        let currentValue = parseInt(element.innerText, 10) || 0;
        if (mode === "up") {
          element.innerText = currentValue + 1;
        } else {
          element.innerText = currentValue - 1;
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          toast("You have already voted", {
            type: "error",
          });
        }
      }).finally(() => {
        setIsVoted(false);
      });
    }
    
  };

  const navigate = useNavigate();
  useEffect(() => {
    document.querySelectorAll(".ql-syntax").forEach((el) => {
      el.classList.add(
        "border",
        "mt-3",
        "border-gray-200",
        "bg-gray-100",
        "p-4",
        "rounded-md",
        "overflow-x-auto"
      );
    });
    document.querySelectorAll(".question-content a").forEach((a) => {
      console.log(a);
      a.classList.add("text-blue-600", "underline", "hover:text-blue-800");
    });
  }, []);
  return (
    <>
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
      <div className="max-w-5xl mx-auto my-5 border-b border-gray-300  bg-white p-5">
        <div className="flex justify-between items-center">
          <div className="text-2xl w-3/5 text-wrap">{title}</div>
          <div className="flex w-2/5 justify-end">
            {isBelong === true ? (
              <button
                onClick={() => navigate(`/question/edit/${id}`)}
                className="bg-white
                 text-black px-4 py-2 
                 border rounded-md hover:bg-blue-600 mr-3
                  border-blue-300 hover:text-white
                  hover:opacity-90"
              >
                Edit
              </button>
            ) : null}
            <button
              onClick={() => navigate("/question/ask")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Ask Question
            </button>
          </div>
        </div>
        <div>
          <ul className="flex gap-4 mt-4">
            <li>
              <span className="text-gray-500">Created:</span>{" "}
              {converDate(createdAt)}
            </li>
            <li>
              <span className="text-gray-500">Updated:</span>{" "}
              {converDate(updatedAt)}
            </li>
            <li>
              <span className="text-gray-500">Views:</span> {views}
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-5xl mx-auto border-b border-gray-300 bg-white p-5">
        <div className="flex">
          <div>
            <ul>
              <li>
                <button className="border border-gray-300 rounded-full px-2 py-2 hover:bg-gray-100">
                  <ArrowUp
                    onClick={() => voteQuestion(id, "up")}
                    size={24}
                    className="text-gray-700"
                  />
                </button>
              </li>
              <li id={id} className="text-black text-3xl px-3 py-2">
                {votes.length}
              </li>
              <li>
                <button className="border border-gray-300 rounded-full px-2 py-2 hover:bg-gray-100">
                  <ArrowUp
                    onClick={() => voteQuestion(id, "down")}
                    size={24}
                    className="text-gray-700 transform rotate-180"
                  />
                </button>
              </li>
            </ul>
          </div>
          <div>
            <div className="ml-5 question-content">
              <div dangerouslySetInnerHTML={{ __html: problem }}></div>
              <div dangerouslySetInnerHTML={{ __html: expect }}></div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="ml-5">
                <ul className="flex gap-4 mt-4 ">
                  {tags.map((tag, index) => (
                    <li
                      key={index}
                      onClick={() => navigate(`/questions/tagged/${tag.tagName}`)}
                      className="bg-gray-200 px-3 py-1 rounded-md font-semibold cursor-pointer"
                    >
                      {tag.tagName}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center mr-4 mt-4">
                <img
                  src={createdUser.profileImage}
                  alt="avatar"
                  className="w-6 h-6 rounded-full"
                />
                <span className="ml-2 text-blue-600 text-thin">
                  {createdUser.displayName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto  bg-white p-5">
        <h2 className="text-2xl font-normal ">{answers.length} Answers</h2>
      </div>
      {answers.map((answer) => (
        <AnswerDetail
          key={answer.id}
          questionId={answer.id}
          content={answer.content}
          isApproved={answer.isApproved}
          createdAt={converDate(answer.createdAt)}
          updatedAt={converDate(answer.updatedAt)}
          votes={answer.answerVotes}
          createdUser={answer.createdUser}
        />
      ))}

      <AnswerInput />
    </>
  );
}
