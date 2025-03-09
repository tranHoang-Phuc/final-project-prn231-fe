import React from "react";
import { convert } from "html-to-text";
import { useNavigate } from "react-router-dom";
export default function Question({
  id,
  title,
  description,
  questionTags,
  createdUser,
  views,
  createdAt,
  questionVotes,
  answers,
}) {

  const navigate = useNavigate();
  const timeConverter = (date) => {
    const formattedDate =
      date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }) +
      " - " +
      date.toLocaleDateString("vi-VN");
    return formattedDate;
  };
  const checkAnswer = (answers) => {
    return answers.length > 0;
  };

  const checkApprovedAnswer = (answers) => {
    return answers.some((answer) => answer.isApproved);
  };
  return (
    <div className="flex border-b border-gray-300 rounded-lg max-w-4xl mx-auto bg-white p-3">
      <div className="w-1/6 p-2">
        <ul className="text-right">
          <li className="pr-6">{questionVotes.length} votes</li>
          <li
            className={`text-gray-600 pt-2  pr-6 pb-2 border rounded-xl ${
              checkAnswer(answers) ? " border-green-700" : "border-transparent"
            }  ${checkApprovedAnswer(answers) ? "bg-green-700 text-white" : ""}`}
          >
            {answers.length} answers
          </li>{" "}
          <li className="text-gray-600 pr-6">{views} views</li>
        </ul>
      </div>
      <div className="w-5/6 mx-3 flex flex-col flex-grow min-w-0">
        <div>
          <h2 onClick={() => navigate(`/questions/detail/${id}`)} className="line-clamp-2 cursor-pointer hover:text-blue-700 text-blue-500 text-xl font-medium break-words">
            {title}
          </h2>
          <p className="text-gray-600 line-clamp-2 whitespace-normal break-words overflow-hidden text-ellipsis max-w-full">
            {convert(description, { wordwrap: false })}
          </p>
        </div>
        <div className="flex justify-between items-center mt-1">
          <ul className="flex gap-2 mt-2">
            {questionTags.map((tag, index) => (
              <li
                key={index}
                onClick={() => navigate(`/questions/tagged/${tag.tagName}`)}
                className="bg-gray-200 font-bold text-gray-600 px-2 py-1 rounded-md text-sm cursor-pointer"
              >
                {tag.tagName}
              </li>
            ))}
          </ul>
          <div className="flex">
            <div className="flex items-center mr-4">
              <img
                src={createdUser.profileImage}
                alt="avatar"
                className="w-6 h-6 rounded-full"
              />
              <span className="ml-1 text-blue-600 text-thin">
                {createdUser.displayName}
              </span>
            </div>

            <div className="flex items-center gap-2 ">
              <span className="text-gray-600">
                {timeConverter(new Date(createdAt))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
