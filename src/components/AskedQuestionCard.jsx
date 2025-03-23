import React from "react";
import { useNavigate } from "react-router-dom";

export default function AskedQuestionCard({ question }) {
  const navigate = useNavigate();
  const tags = question.questionTags;
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
  return (
    <div className="border-b-2 border-gray-200 p-3">
      <div className="">
        <ul className="flex flex-row gap-2">
          <li>{question.questionVotes.length} votes</li>
          <li className="text-gray-500">{question.answers.length} answers</li>
          <li className="text-gray-500">{question.views} views</li>
          
        </ul>
      </div>
      <div>
        {/* <h2 className=' font-normal mt-2'>{question.title}</h2> */}
        <h2 className="text-xl font-normal mt-2 text-blue-500 hover:text-blue-800"
        
        onClick={() => navigate(`/questions/detail/${question.id}`)}>
          {question.title}
        </h2>
      </div>
      <div className="flex flex-row justify-between">
        <ul className="flex flex-row gap-2 mt-2">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="p-1 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer font-semibold"
              onClick={() => navigate(`/questions/tagged/${tag.tagName}`)}
            >
              {tag.tagName}
            </li>
          ))}
        </ul>
        <div className="text-gray-500 mt-2">asked at {timeConverter(new Date(question.createdAt))}</div>
      </div>
    </div>
  );
}
