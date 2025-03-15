import React from "react";
import MenuNavigate from "../components/MenuNavigate";
import TagView from "../components/TagView";
import { useState } from "react";
import TagInput from "../components/TagInput";
import Pagination from "../components/Pagination";
import TagPagination from "../components/TagPagination";

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(16);
  return (
    <>
      <MenuNavigate />
      <div className="border-b border-gray-300 rounded-lg max-w-5xl mx-auto bg-white p-5">
        <TagInput 
          setTags={setTags}
          currentPage ={currentPage}
          setTotalPages={setTotalPages} 
          perPage={perPage}/>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {Array.isArray(tags) &&
            tags.map((tag, index) => (
              <TagView
                key={tag.tagName || index}
                tagName={tag.tagName}
                numberOfQuestions={tag.numberOfQuestions}
                askedThisWeek={tag.numberOfQuestionThisWeek}
              />
            ))}
        </div>
        <div>
          <TagPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}
