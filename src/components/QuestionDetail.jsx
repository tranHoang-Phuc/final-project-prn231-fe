import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { useEffect } from "react";
import AnswerDetail from "./AnswerDetail";
import AnswerInput from "./AnswerInput";

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
      <div className="max-w-5xl mx-auto my-5 border-b border-gray-300  bg-white p-5">
        <div className="flex justify-between items-center">
          <div className="text-2xl w-4/5 text-wrap">{title}</div>
          <div className="">
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
              <span className="text-gray-500">Created:</span> {converDate(createdAt)}
            </li>
            <li>
              <span className="text-gray-500">Updated:</span> {converDate(updatedAt)}
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
                  <ArrowUp size={24} className="text-gray-700" />
                </button>
              </li>
              <li className="text-black text-3xl px-3 py-2">{votes.length}</li>
              <li>
                <button className="border border-gray-300 rounded-full px-2 py-2 hover:bg-gray-100">
                  <ArrowUp
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
                      className="bg-gray-200 px-3 py-1 rounded-md font-semibold"
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
