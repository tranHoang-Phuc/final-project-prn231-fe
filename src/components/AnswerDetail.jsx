import React from "react";
import { ArrowUp, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BaseUrl } from "../configurations/config";
import axios from "axios";
import { getToken, getUser } from "../services/localStorageService";
import { isBelongTo, isOwner } from "../services/inbound";
import { motion } from "framer-motion";

export default function AnswerDetail({
  id,
  questionId,
  content,
  createdUser,
  isApproved,
  createdAt,
  updatedAt,
  votes,
  author
}) {
  const token = getToken();
  const navigate = useNavigate();
  const [isAccepted, setIsAccepted] = useState(isApproved);
  const [isEditing, setIsEditing] = useState(false);
  const isBelong = isBelongTo(createdUser.id);
  const [newContent, setNewContent] = useState(content);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
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
      a.classList.add("text-blue-600", "underline", "hover:text-blue-800");
    });
  }, []);

  const handleVote = (answerId, vote) => {
    axios
      .post(`${BaseUrl.uri}/answer/${answerId}/${vote}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        let element = document.getElementById(answerId);
        let currentValue = parseInt(element.innerText, 10) || 0;
        element.innerText = currentValue + 1;
      }).catch((error) => {
        if (error.response.status === 401) {
          navigate("/login");             
        }});
  };

  const acceptAnswer = (answerId) => {
    axios
      .put(
        `${BaseUrl.uri}/answer/${questionId}/answers/${answerId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setIsAccepted(true);
      }).catch((error) => {
        if (error.response.status === 401) {
          navigate("/login");             
        }});
  };



  const handleDelete = () => {
    setShowConfirmDeleteModal(true);
  };
  return (
    <>
      <div id={id} className="max-w-4xl mx-auto border-b border-gray-300 bg-white p-5">
        { !isAccepted && getUser().id === author && (
          <button
            onClick={() => acceptAnswer(id)}
            className="text-white border border-blue-500 bg-blue-500 p-2 mb-2 rounded-xl mr-3"
          >
            Accept
          </button>
        )}
        {isBelong && (
          <div>
            <button
              className="text-blue-500 border border-blue-500 bg-red-white p-2 mb-2 rounded-xl mr-3"
              onClick={() => {
                  console.log("edit" + id);
                  console.log(typeof id);
                  navigate(`/questions/${questionId}/answers/${id}/edit`);
              }}
            >
              Edit
            </button>
            <button className="text-white border border-red-500 bg-red-500 p-2 mb-2 rounded-xl"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
        <div className="flex">
          <div>
            <ul>
              <li>
                <button className="border border-gray-300 rounded-full px-2 py-2 hover:bg-gray-100">
                  <ArrowUp
                    size={24}
                    onClick={() => handleVote(id, "up")}
                    className="text-gray-700 "
                  />
                </button>
              </li>
              <li id={id} className="text-black text-3xl px-3 py-2">
                {votes.length}
              </li>
              <li>
                <button className="border border-gray-300 rounded-full px-2 py-2 hover:bg-gray-100">
                  <ArrowUp
                    size={24}
                    onClick={() => handleVote(id, "down")}
                    className="text-gray-700 transform rotate-180"
                  />
                </button>
              </li>
              {isAccepted && (
                <li>
                  <button className=" px-2 py-2 ">
                    <Check size={24} className="text-green-500" />
                  </button> 
                </li>
              )}
            </ul>
          </div>
          <div className="w-full">
            <div className="ml-5 question-content">
              <div className="w-full break-words whitespace-normal overflow-hidden" dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
            <div className="flex justify-between items-center mt-1">
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
                  <span
                    span
                    className="ml-2 text-blue-600 text-thin cursor-pointer"
                    onClick={
                      isOwner(createdUser.id)
                        ? () => navigate("/profile")
                        : () => navigate(`/profile/${createdUser.aliasName}`)
                    }
                  >
                    {createdUser.displayName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center"
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              onClick={() => setShowConfirmDeleteModal(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Do you want to delete?</h2>
            <div className="flex justify-between">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  axios
                    .delete(`${BaseUrl.uri}/answer/${id}`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    })
                    .then(() => {
                      // navigate(`/profile`);
                    });
                  setShowConfirmDeleteModal(false);
                  window.location.reload();
                }}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                onClick={() => setShowConfirmDeleteModal(false)}
              >
                No
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
