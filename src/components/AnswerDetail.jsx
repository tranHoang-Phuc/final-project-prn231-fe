import React from "react";
import { ArrowUp, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BaseUrl } from "../configurations/config";
import axios from "axios";
import { getToken } from "../services/localStorageService";

export default function AnswerDetail({
  id,
  questionId,
  content,
  createdUser,
  isApproved,
  createdAt,
  updatedAt,
  votes,
}) {
  const token = getToken();
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

  const handleVote = (answerId, vote) => {
    axios.post(`${BaseUrl.uri}/answer/${answerId}/${vote}`, 
      {headers:{Authorization: `Bearer ${token}`}}
    ).then((response) => {
      let element = document.getElementById(answerId); 
      let currentValue = parseInt(element.innerText, 10) || 0
      element.innerText = currentValue + 1;  
     });
  }
  return (
    <>
      <div className="max-w-5xl mx-auto border-b border-gray-300 bg-white p-5">
        <div className="flex">
          <div>
            <ul>
              <li>
                <button className="border border-gray-300 rounded-full px-2 py-2 hover:bg-gray-100">
                  <ArrowUp size={24} 
                    onClick={(answerId) => handleVote(answerId, "up")}  
                    className="text-gray-700 " />
                </button>
              </li>
              <li id={id} className="text-black text-3xl px-3 py-2">{votes.length}</li>
              <li>
                <button className="border border-gray-300 rounded-full px-2 py-2 hover:bg-gray-100">
                  <ArrowUp
                    size={24}
                    onClick={(answerId) => handleVote(answerId, "down")}
                    className="text-gray-700 transform rotate-180"
                  />
                </button>
              </li>
              {isApproved && (
                <li>
                  <button className=" px-2 py-2 ">
                    <Check size={24} className="text-green-500" />
                  </button>
                </li>
              )}
            </ul>
          </div>
          <div>
            <div className="ml-5 question-content">
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="ml-5"></div>
              <div className=" mr-4 mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="text-gray-600">Created:</span> {createdAt}
                  <span className="text-gray-600 ml-2">Updated:</span>{" "}
                  {updatedAt}
                </div>
                <div className="flex ml-6">
                  <img
                    src={createdUser.profileImage}
                    alt="avatar"
                    className="w-6 h-6 rounded-full"
                  />
                  <span span className="ml-2 text-blue-600 text-thin">
                    {createdUser.displayName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
