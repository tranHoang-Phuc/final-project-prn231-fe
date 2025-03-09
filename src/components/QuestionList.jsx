import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Question from "./Question";
import Pagination from "./Pagination";
import axios from "axios";
import { BaseUrl } from "../configurations/config";
import { getToken } from "../services/localStorageService";
export default function QuestionList({tagName}) {
  const token = getToken();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Newest");
  const [showFilter, setShowFilter] = useState(false); // Quản lý hiển thị bộ lọc
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [filterBy, setFilterBy] = useState([]);
  const [sortedBy, setSortedBy] = useState("Newest");
  const [taggedWith, setTaggedWith] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(0);
  const [numOfQuestions, setNumOfQuestions] = useState(0);
  const toggleFilter = (value) => {
    setFilterBy((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };
  useEffect(() => {
    let sortedQuestions = [...questions]; 
    switch (activeTab) {
      case "Newest":
        sortedQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "Unanswered":
        sortedQuestions.sort((a, b) => a.answers.length - b.answers.length); // Sắp xếp giảm dần
        break;
      case "Views":
        sortedQuestions.sort((a, b) => b.views - a.views); // Sắp xếp giảm dần
        break;
      default:
        break;
    }
  
    setQuestions(sortedQuestions);
  }, [activeTab]);
  

  useEffect(() => {
    
    const tags = tagName ? [tagName].join(",") : null;
    console.log(tagName);
    axios.get(`${BaseUrl.uri}/question`, {
      params: {
          pageSize: perPage,
          pageIndex: currentPage,
          filter: null,
          order: null,
          tags: tags,  
          search: null,
      },
      headers:{Authorization: `Bearer ${token}`},
  })
  .then((response) => {
      setActiveTab("Newest");
      const questionListSorted = response.data.data.questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNumOfQuestions(response.data.data.total);
      setQuestions(questionListSorted);
  })
  }, [currentPage, tagName, perPage]);
  return (
    <>
      <div className="border-b border-gray-300 rounded-lg max-w-4xl mx-auto bg-white p-5">
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <h2 className="text-black text-3xl font-normal">Questions</h2>
          <button
            onClick={() => navigate("/question/ask")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Ask Question
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex justify-between items-center w-full mt-6">
          <h4 className="text-gray-600 text-xl">{numOfQuestions} questions</h4>
          <div className="flex">
            <div className="flex space-x-2 border border-gray-400 p-2 rounded-lg">
              {["Newest", "Unanswered", "Views"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="ml-3 px-3 py-1 border rounded-md flex items-center space-x-1 text-sm text-blue-600 hover:bg-blue-50"
            >
              <span>☰</span>
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilter && (
          <div className="mt-5 border p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold">Filter Options</h3>
            <div className="grid grid-cols-3 gap-4 mt-3">
              {/* Filter by */}
              <div>
                <h4 className="font-medium">Filter by</h4>
                <label className="block">
                  <input type="checkbox" className="mr-2" onClick={() => toggleFilter("no-answer")} /> No answers
                </label>
                <label className="block">
                  <input type="checkbox" className="mr-2" onClick={() => toggleFilter("no-accepted-answer")} /> No accepted answer
                </label>
                <label className="block  items-center">
                  <input
                    type="number"
                    className="border px-2 py-1 rounded w-20 ml-2"
                    placeholder="Days old"
                  />
                </label>
              </div>

              {/* Sorted by */}
              <div>
                <h4 className="font-medium">Sorted by</h4>
                {["Newest", "Views", "Oldest", "Score"].map(
                  (option) => (
                    <label key={option} className="block">
                      <input
                        type="radio"
                        name="sort"
                        className="mr-2"
                        defaultChecked={option === "Newest"}
                        onClick={() => setSortedBy(option.toLowerCase())}
                      />{" "}
                      {option}
                    </label>
                  )
                )}
              </div>

              {/* Tagged with */}
              <div>
                <h4 className="font-medium">Tagged with</h4>
                <label className="block">
                  <input type="radio" name="tags" className="mr-2" onChange={(e) => setTaggedWith(e.target.value)} /> My watched
                  tags
                </label>
                <label className="block">
                  <input
                    type="radio"
                    name="tags"
                    className="mr-2"
                    defaultChecked
                  />{" "}
                  The following tags:
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full mt-1"
                    placeholder="e.g. javascript or python"
                  />
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Apply filter
                </button>
              </div>
              <button
                onClick={() => setShowFilter(false)}
                className="text-red-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Questions */}
      {questions.length > 0 ? (
          questions.map((q, index) => (
            <Question
              key={index}
              id={q.id}
              title={q.title}
              description={q.detailProblem}
              questionTags={q.questionTags || []}
              createdUser={q.createdUser}
              views={q.views}
              createdAt={q.createdAt}
              questionVotes={q.questionVotes || []}
              answers={q.answers || []}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No questions found.</p>
        )}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
      />
    </>
  );
}
